# Sync Engine Telemetry — Operations Guide

How to read the operational telemetry that ships with the [board sync engine](./sync-engine.md).

Use this doc when you want to answer, from production data: is the rollout reaching users, does
first sync *complete*, do local boards *graduate* without jamming, and how often does sync throw.
It documents the events the engine emits, where they fire, the Kusto queries that interpret them,
and the alerts that watch them.

> **What this telemetry is.** It is **observational** — it records what the engine does, it does
> not change how the engine runs. See §0 for the one consequence of that worth keeping in mind.

---

## 0. What this telemetry can and cannot tell you

This telemetry is read-only instrumentation. That bounds what it delivers:

- ✅ It tells you, across the fleet, **whether the rollout is reaching users**, whether first
  sync **completes**, whether **graduation** jams, and **how often sync throws**.
- ❌ It does **not** prevent board data loss. A bad manifest can still mass-delete graduated
  boards; `Sync_RemoteDeletions` (§4.4) is a smoke detector that fires *after* the delete and
  cannot recover an already-purged local board.

If preventing local-board loss becomes a priority, that is a **separate** change (a
manifest-sanity guard in the engine) — not something this telemetry does on its own.

---

## 1. Events the engine emits

All events go through `trackSyncEvent` / `trackSyncException` in
[`src/components/Board/Board.sync.analytics.js`](../src/components/Board/Board.sync.analytics.js),
thin wrappers over `appInsights` (auto-disabled in dev; `user_Id` / `session_Id` already attached
via `setAuthenticatedUserContext` on login).

**Convention:** numeric counts live in `measurements` (`customMeasurements` in Kusto);
categorical context lives in `properties` (`customDimensions`). Every event and exception carries
`feature: "sync"`, so the `customEvents` and `exceptions` tables join cleanly. There is **no
`appVersion` dimension** — cohort by time instead (see §3).

### `Sync_FirstRun`
The first onboarding sync of a device — fires at the top of `syncBoards()` when `syncMeta` is
empty but boards exist. (It fires again if that first sync fails before `syncMeta` is written;
`dcount(user_Id)` in the queries dedupes, so adoption counts stay correct.)

| field | bag | meaning |
|---|---|---|
| `totalBoards` | measurements | boards at first sync |
| `localBoards` | measurements | short-id boards |
| `serverBoards` | measurements | objectId boards |

### `Sync_Graduation`
Once per cycle, in `classifyBoardsForPush`, whenever any untracked board was seen.

| field | bag | meaning |
|---|---|---|
| `untrackedSeen` | measurements | untracked boards entering Pass 2 |
| `graduated` | measurements | remote exists + same/older → SYNCED, no API call |
| `pushedNew` | measurements | `needsCreate: true` |
| `pushedUpdate` | measurements | `needsCreate: false` |

### `Sync_Completed`
On every **board-sync cycle**, success or failure. Scope is the board phase only
(`syncBoards()`); it does not cover the communicators phase. For the whole sync flight, see
`Sync_FullRun`.

| field | bag | meaning |
|---|---|---|
| `outcome` | properties | `success` \| `failure` |
| `durationMs` | measurements | wall time of the cycle |
| `pendingBefore` | measurements | PENDING boards pre-sync |
| `pendingAfter` | measurements | PENDING boards post-sync |

### `Sync_FullRun`
On every full sync flight driven by `getApiObjects()` — the top-level entry point that runs the
board phase (`getApiMyBoards` → `syncBoards`) **and** the communicators phase
(`getApiMyCommunicators`). Where `Sync_Completed` covers only the board phase, this event reports
whether the whole path completed, so a communicators-only failure (previously swallowed by a
`console.error`) is now visible. Fires once per call, including when the single-flight guard skips
the run.

| field | bag | meaning |
|---|---|---|
| `outcome` | properties | `success` (both phases ok) \| `failure` (a phase threw) \| `skipped` (guard hit, sync already in progress) |
| `source` | properties | what triggered the sync (e.g. login, manual `SyncButton`) |
| `boardsOk` | properties | `"true"` \| `"false"` — did the board phase complete |
| `communicatorsOk` | properties | `"true"` \| `"false"` — did the communicators phase complete |
| `durationMs` | measurements | wall time of the full flight (omitted on `skipped`) |

### `Sync_RemoteDeletions` — passive data-loss detector
Once per cycle in `syncBoards()`, after the per-id confirmation pass, **only when
`boardIdsToDelete` is non-empty**. Every counted deletion carried the double signal — absent from
the manifest AND absent from a fresh `POST /board/byids` read. This event makes the fleet-wide
volume of those deletions visible, so an anomalous spike (e.g. the server omitting boards that
should exist) is caught the day it deploys. It **counts** what the cycle is about to delete — it
does not stop it.

| field | bag | meaning |
|---|---|---|
| `deletedCount` | measurements | boards this cycle will hard-delete via PULL |
| `manifestSize` | measurements | boards in the remote manifest (`remoteBoards.length`) |
| `localServerBoards` | measurements | local boards with a server id, pre-delete (deletion denominator) |

### `Sync_PushNotFoundDelete`
In the push-loop catch, when a board's push PUT returns **404**, the board is **absent from this
cycle's manifest**, and a confirmation **`POST /board/byids` read also omits it** — the triple
signal that hard-deletes it locally (untracked zombies and edit-vs-delete conflicts, see
`docs/sync-engine.md` §14). This event is the safety monitor for that path: it should be rare and
near-exclusively `tracked: "false"`. Firings for boards that still exist in the DB would mean the
by-ids confirmation itself is unreliable — investigate server-side before touching the client.

| field | bag | meaning |
|---|---|---|
| `boardId` | properties | the board being hard-deleted |
| `tracked` | properties | `"true"` = had `syncMeta` (edit-vs-delete conflict, local edit lost) \| `"false"` = untracked zombie |
| `boardLastEdited` | properties | the board's local `lastEdited` |
| `manifestWatermark` | properties | newest `lastEdited` in the manifest at delete time |
| `manifestSize` | measurements | boards in the remote manifest |

### Sync exceptions
Several failure paths additionally call `trackSyncException`, each tagged with a `phase` so you can
tell them apart in the `exceptions` table:

| `phase` | where | was previously |
|---|---|---|
| `pullBulkFetch` | bulk board-body fetch catch | `console.error` only (invisible in cloud) |
| `confirmDeletions` | per-chunk catch in `confirmServerDeletions` — a failing `/board/byids` keeps every candidate (fail-safe) but silently disables remote deletions, so it must be visible | new in this change |
| `pushBoard` | per-board push catch (also carries `boardId`) | `console.error` only |
| `syncBoards` | top-level cycle catch | `console.error` only |
| `getApiMyBoards` | full-path board phase catch in `getApiObjects` (also carries `source`) | `console.error` only |
| `getApiMyCommunicators` | full-path communicators phase catch in `getApiObjects` (also carries `source`) | `console.error` only |

These were silent before — surfacing them in the cloud is the highest-value part of this
telemetry.

---

## 2. Where each signal fires

| Event / signal | File / function |
|---|---|
| `Sync_FirstRun` | `Board.actions.js` → `syncBoards()`, after the pre-PULL `getState().board` read |
| `Sync_Graduation` | `Board.actions.js` → `classifyBoardsForPush`, before the batched `markBoardsSynced` |
| `Sync_Completed` | `Board.actions.js` → `syncBoards()` success & catch (board phase only) |
| `Sync_FullRun` | `Board.actions.js` → `getApiObjects()` `finally` (and the early `isSyncing` guard) |
| `Sync_RemoteDeletions` | `Board.actions.js` → `syncBoards()`, after the per-id confirmation pass (`confirmServerDeletions`), guarded by `boardIdsToDelete.length > 0` |
| `Sync_PushNotFoundDelete` | `Board.actions.js` → `pushLocalChangesToApi` push-loop catch, before the 404 hard delete |
| `trackSyncException` | `Board.actions.js` → the six sync `catch` blocks (`pullBulkFetch`, `confirmDeletions`, `pushBoard`, `syncBoards`, `getApiMyBoards`, `getApiMyCommunicators`) |

The helper lives in `Board.sync.analytics.js` and is kept in the actions layer because these
events need computed before/after state and timing that the redux-beacon `eventsMap` can't
express. It mirrors the existing `StorageMigration_*` pattern in `src/reducers.js`.

---

## 3. Cohorting by time (why there is no `appVersion`)

The app has **no maintained version source**: `package.json` is stale (`0.1.1`) and CRA does not
expose it to the browser. So **cohort by time** instead — releases are discrete deploys, so
`bin(timestamp, 1d)` plus the known deploy date of each ring is enough to read the rollout.

> **If you want per-version cohorting later:** inject a build version from CI
> (`REACT_APP_VERSION=$(git rev-parse --short HEAD)`), read it in `src/constants.js`, add it back
> as a `properties.appVersion` dimension, and swap the `bin(timestamp,1d)` cohorting below for
> `by appVersion`. Not required to use the telemetry as shipped.

```kusto
// customMeasurements values are dynamic — cast with todouble(...) before aggregating.
```

---

## 4. Queries

Paste these into App Insights → Logs. Adjust the `ago(...)` lookbacks to your window.

### 4.1 Adoption — is the rollout reaching users?

```kusto
customEvents
| where timestamp > ago(30d) and name == "Sync_FirstRun"
| summarize firstRunUsers = dcount(user_Id) by bin(timestamp, 1d)
| render timechart
```

Cumulative adoption S-curve:

```kusto
customEvents
| where timestamp > ago(30d) and name == "Sync_FirstRun"
| summarize users = dcount(user_Id) by day = bin(timestamp, 1d)
| order by day asc
| extend cumulativeUsers = row_cumsum(users)
| render timechart
```

### 4.2 Completion funnel — did first sync finish?

```kusto
let lookback = 14d;
let firstRuns =
    customEvents
    | where timestamp > ago(lookback) and name == "Sync_FirstRun"
    | project user_Id, session_Id;
let completions =
    customEvents
    | where timestamp > ago(lookback) and name == "Sync_Completed"
    | extend outcome = tostring(customDimensions.outcome)
    | project user_Id, session_Id, outcome;
firstRuns
| join kind=leftouter completions on user_Id, session_Id
| summarize
    started        = dcount(user_Id),
    completedOk    = dcountif(user_Id, outcome == "success"),
    completedFail  = dcountif(user_Id, outcome == "failure"),
    neverCompleted = dcountif(user_Id, isempty(outcome))
| extend completionRatePct = round(100.0 * completedOk / started, 1)
```

Healthy: `completionRatePct` near 100, `neverCompleted` ≈ 0.

### 4.3 Graduation-stuck detector

A board seen untracked in one cycle should be tracked by the next. The same user reporting
`untrackedSeen > 0` across ≥2 cycles means graduation has jammed.

```kusto
let lookback = 7d;
customEvents
| where timestamp > ago(lookback) and name == "Sync_Graduation"
| extend untrackedSeen = todouble(customMeasurements.untrackedSeen)
| where untrackedSeen > 0
| summarize cyclesStuck = count(), lastSeen = max(timestamp), maxUntracked = max(untrackedSeen)
    by user_Id
| where cyclesStuck >= 2
| order by cyclesStuck desc
```

Graduate-vs-push distribution (sanity that Pass 2 takes the no-API graduation path):

```kusto
customEvents
| where timestamp > ago(14d) and name == "Sync_Graduation"
| extend
    graduated    = todouble(customMeasurements.graduated),
    pushedNew    = todouble(customMeasurements.pushedNew),
    pushedUpdate = todouble(customMeasurements.pushedUpdate)
| summarize totalGraduated = sum(graduated), totalPushedNew = sum(pushedNew), totalPushedUpdate = sum(pushedUpdate)
    by bin(timestamp, 1d)
```

### 4.4 Remote deletions — is the engine deleting more than expected?

The smoke detector for the one open data-loss path (bad manifest → mass delete). Watch for a
spike the day a release deploys, or any cycle where `deletedCount` is large relative to
`manifestSize` (a near-empty manifest deleting many local server boards is the danger shape).

```kusto
customEvents
| where timestamp > ago(30d) and name == "Sync_RemoteDeletions"
| extend
    deletedCount      = todouble(customMeasurements.deletedCount),
    manifestSize      = todouble(customMeasurements.manifestSize),
    localServerBoards = todouble(customMeasurements.localServerBoards)
| summarize
    cycles          = count(),
    usersAffected   = dcount(user_Id),
    boardsDeleted   = sum(deletedCount),
    maxDeletedInOne = max(deletedCount)
    by bin(timestamp, 1d)
| render timechart
```

Suspicious-cycle drill-down (manifest implausibly small vs. what's being deleted):

```kusto
customEvents
| where timestamp > ago(30d) and name == "Sync_RemoteDeletions"
| extend
    deletedCount      = todouble(customMeasurements.deletedCount),
    manifestSize      = todouble(customMeasurements.manifestSize),
    localServerBoards = todouble(customMeasurements.localServerBoards)
| where deletedCount >= 5 and manifestSize <= localServerBoards * 0.5
| project timestamp, user_Id, deletedCount, manifestSize, localServerBoards
| order by deletedCount desc
```

### 4.5 Stuck PENDING — boards that never finish pushing

`Sync_Completed` reports `success` even when a per-board push silently failed (that path emits a
`pushBoard` exception but the cycle still succeeds). A user whose `pendingAfter` stays > 0 across
cycles has boards stuck local.

```kusto
let lookback = 7d;
customEvents
| where timestamp > ago(lookback) and name == "Sync_Completed"
| extend pendingAfter = todouble(customMeasurements.pendingAfter)
| where pendingAfter > 0
| summarize cyclesStuck = count(), lastSeen = max(timestamp), maxPending = max(pendingAfter)
    by user_Id
| where cyclesStuck >= 3
| order by maxPending desc
```

Cross-reference a stuck user against their `pushBoard` exceptions:

```kusto
exceptions
| where timestamp > ago(7d)
    and tostring(customDimensions.feature) == "sync"
    and tostring(customDimensions.phase) == "pushBoard"
| project timestamp, user_Id, boardId = tostring(customDimensions.boardId), problemId, outerMessage
| order by timestamp desc
```

### 4.6 Health — sync error rate

```kusto
let lookback = 14d;
let syncEvents =
    customEvents
    | where timestamp > ago(lookback) and name startswith "Sync_"
    | summarize cycles = count() by day = bin(timestamp, 1d);
let syncErrors =
    exceptions
    | where timestamp > ago(lookback) and tostring(customDimensions.feature) == "sync"
    | summarize errors = count() by day = bin(timestamp, 1d);
syncEvents
| join kind=leftouter syncErrors on day
| extend errors = coalesce(errors, 0), errorRatePct = round(100.0 * coalesce(errors,0) / cycles, 2)
| project day, cycles, errors, errorRatePct
| order by day asc
| render timechart
```

---

## 5. Alerts to configure

Set up one scheduled log alert (run every 1h, fire when result count > 0) per critical signal:

| Alert | Query basis | Means |
|---|---|---|
| **Mass remote deletion** | §4.4 drill-down, any row in last 1h | a cycle deleted many boards against a tiny manifest — the open data-loss shape; investigate the manifest source immediately |
| **Graduation stuck** | §4.3 with `cyclesStuck >= 2` over last 2h | a user can't onboard their boards |
| **Sync error spike** | §4.6 `errorRatePct` over threshold | sync is throwing more than baseline |

> The mass-deletion alert is the highest priority: with no engine guard in place it fires *after*
> the delete, so treat any trip as a signal to **halt the ramp** and inspect the manifest, not
> just to observe. If it trips repeatedly, the durable fix is a manifest-sanity guard in the
> engine, not more watching.

---

## 6. Dashboard layout

One Workbook, three tiles:

1. **Adoption** — §4.1 timechart.
2. **Health** — §4.2 funnel + §4.5 stuck-PENDING + §4.6 error rate.
3. **Safety & graduation** — §4.4 remote-deletions timechart + §4.3 graduation-stuck detector.

---

## 7. Retention — how long to keep each signal

Two tiers, deliberately:

- **Rollout/migration events** (`Sync_FirstRun`, `Sync_Graduation`): keep through the ramp
  **plus a ~2–4 week stabilization tail** with the stuck signal flat. Then retire or sample down
  — they answer a one-time migration question that expires.
- **Health/safety telemetry** (`Sync_Completed`, `Sync_RemoteDeletions`, all sync exceptions):
  **keep.** These are invariants of the engine, not rollout metrics, and should outlive the
  release — `Sync_RemoteDeletions` especially, since it is the only observability over the
  unmitigated mass-deletion path.

Operational notes:

- Payloads are scalar counts and short ids only. These events ride authenticated user context —
  treat as personal data; no labels/emails.
- App Insights / Kusto is the store; don't export — exporting a transient ops signal creates a
  governance obligation.
- Consider excluding `Sync_*` names from ingestion sampling during the ramp so counts are exact
  rather than estimated.
</content>
</invoke>
