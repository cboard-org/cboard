# Board Synchronization Engine

Technical reference for Cboard's two-phase board synchronization engine.
This document describes how local boards are kept in sync with the remote API,
covering every function in the pipeline, state transitions, side effects, and
edge cases.

> **Audience:** project maintainers, collaborators, and AI models.

---

## Table of Contents

1. [Glossary](#1-glossary)
2. [Overview](#2-overview)
3. [Entry Point](#3-entry-point)
4. [Orchestrator: `syncBoards()`](#4-orchestrator-syncboards)
5. [Phase 1 — PULL](#5-phase-1--pull)
6. [Phase 2 — PUSH](#6-phase-2--push)
7. [Untracked Boards: Onboarding Pre-Existing Boards](#7-untracked-boards-onboarding-pre-existing-boards)
8. [`updateApiObjectsNoChild()` Deep Dive](#8-updateapiobjectsnochild-deep-dive)
9. [Board Identity Model](#9-board-identity-model)
10. [State Management](#10-state-management)
11. [Sync Lifecycle Catalog](#11-sync-lifecycle-catalog)
12. [UI State Mapping](#12-ui-state-mapping)
13. [Sync Status Flow Diagram](#13-sync-status-flow-diagram)
14. [Error Handling & Edge Cases](#14-error-handling--edge-cases)
15. [File Reference Table](#15-file-reference-table)

---

## 1. Glossary

| Term                  | Definition                                                                                                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **syncMeta**          | A Redux state object (`state.board.syncMeta`) that maps each board ID to its sync metadata: `{ status, isDeleted? }`. It is the single source of truth for whether a board needs syncing.                    |
| **Sync manifest**     | The lightweight `{ id, lastEdited }[]` list returned by `getBoardsSync()` (`GET /board/sync/:email`). It is the **authoritative, complete, unpaged** list of the boards that exist on the server. PULL classification runs against it; full board bodies are fetched separately only for the boards it identifies as new or changed. |
| **PENDING**           | `syncMeta` status indicating the board has local changes not yet pushed to the server. Any local edit (board update, tile create/edit/delete) sets this status.                                              |
| **SYNCED**            | `syncMeta` status indicating the board's local state matches the server. Set after successful API create/update or when pulling a remote board.                                                              |
| **isDeleted**         | Boolean flag on a `syncMeta` entry. When `true`, the board is marked for deletion on the server during the next PUSH phase. The board data remains in Redux until the API deletion succeeds.                 |
| **Untracked board**   | A board that has **no** `syncMeta` entry at all. These are boards that existed before the sync engine was introduced. Pass 2 of `classifyBoardsForPush` handles their onboarding into the sync system.       |
| **Graduation**        | The process of assigning a `syncMeta` entry (with status `SYNCED`) to an untracked board without pushing it to the server. This happens when the local version is the same or older than the remote version. |
| **Transformation**    | Converting a default/offline board to belong to the current user by replacing its email, author, locale, and visibility fields. Performed by `transformBoardForUser()`.                                      |
| **Local board**       | A board whose ID was generated locally (short ID, < 14 characters). It has never been persisted to the server.                                                                                               |
| **Server board**      | A board whose ID is a server-assigned MongoDB ObjectId (>= 14 characters). It exists (or existed) on the API.                                                                                                |
| **Default board**     | A board shipped with the app (known ID set + `support@cboard.io` email). These are templates that get transformed into user-owned boards on first sync.                                                      |
| **needsCreate**       | A flag returned by `classifyBoardsForPush` indicating whether the board must be **created** on the server (POST) vs **updated** (PUT). True for local boards and transformed default boards.                 |
| **Communicator**      | The top-level container that holds references to all boards a user has access to, including the `rootBoard` and `activeBoardId`.                                                                             |
| **markToUpdate**      | A board-level flag set by the `CREATE_API_BOARD_SUCCESS` reducer when a tile's `loadBoard` reference changes due to an ID swap. Signals `updateApiMarkedBoards()` to push the board.                         |
| **shouldCreateBoard** | A board-level flag set by `CREATE_API_BOARD_SUCCESS` for local boards that reference the newly-created board but aren't on the server themselves yet. Signals `updateApiMarkedBoards()` to create them.      |
| **Unsynced child reference** | A `tile.loadBoard` on a parent board that points at a local (short-id) child that has **not yet been created** on the server. Pushing such a parent persists a dangling reference. Detected by `hasUnsyncedChildReference()`; the parent is held `PENDING` (not graduated to `SYNCED`) until the child gets a server id and the reference is rewritten.|

---

## 2. Overview

The sync engine implements a **two-phase, PULL-then-PUSH** strategy:

```
Server (API)                          Local (Redux)
     │                                      │
     │  ┌──────────────────────────────┐    │
     │  │  Phase 1: PULL               │    │
     │──┤  Remote → Local              │───▶│  Apply manifest-driven
     │  │  classifyRemoteBoards()      │    │  deletions, then fetch &
     │  │  applyRemoteChangesToState() │    │  apply new/changed bodies
     │  └──────────────────────────────┘    │
     │                                      │
     │  ┌──────────────────────────────┐    │
     │  │  Phase 2: PUSH               │    │
     │◀─┤  Local → Remote              │────│  Upload PENDING boards,
     │  │  classifyBoardsForPush()     │    │  delete marked boards
     │  │  pushLocalChangesToApi()     │    │
     │  └──────────────────────────────┘    │
     │                                      │
```

**Why PULL first?** Applying remote changes before pushing ensures that:

- The PUSH phase sees the most up-to-date state (post-PULL).
- Classification during PULL uses the pre-PULL snapshot, avoiding contamination from boards that PULL just added.
- Conflicts are resolved with a last-write-wins strategy based on `lastEdited` timestamps.

---

## 3. Entry Point

**Function:** `getApiMyBoards()`
**File:** `src/components/Board/Board.actions.js:532`

```
App sync trigger (logged in + online — see §11)
       │
       ▼
  getApiObjects()
       │
       ▼
  getApiMyBoards()
       │
       ├── dispatch(getApiMyBoardsStarted())
       ├── API.getBoardsSync()           ◄── lightweight { id, lastEdited } manifest
       ├── dispatch(getApiMyBoardsSuccess(res))
       │
       └── if res.data is Array:
              dispatch(syncBoards(res.data))   ◄── triggers the engine
```

`getBoardsSync()` (`GET /board/sync/:email`) returns the **complete, unpaged sync manifest** — only `{ id, lastEdited }` per board, not full bodies. That manifest array (`res.data`) is passed directly to `syncBoards()` as the authoritative server state snapshot. Full board bodies (with tiles) are fetched later, only for the boards PULL classifies as new or changed.

> **Note:** `getApiMyBoardsSuccess` only flips `isFetching` — it does **not** store the manifest into `state.board.boards`. The manifest is a classification input, never board data.

---

## 4. Orchestrator: `syncBoards()`

**File:** `src/components/Board/Board.actions.js:817`

`syncBoards(remoteBoards)` is the master orchestrator. It is a Redux thunk that:

1. Dispatches `SYNC_BOARDS_STARTED` (sets `isSyncing: true`).
2. Reads the current local state snapshot (`boards`, `syncMeta`).
3. Runs **Phase 1 (PULL):** classifies remote boards and applies changes.
4. Runs **Phase 2 (PUSH):** classifies local boards and uploads changes.
5. Dispatches `SYNC_BOARDS_SUCCESS` or `SYNC_BOARDS_FAILURE`.

**Critical design note — two-phase state read:**

```javascript
// Phase 1: uses pre-PULL state for classification
const { boards: localBoards, syncMeta } = getState().board;
const { boardsToAdd, boardsToUpdate, boardIdsToVerify } =
  classifyRemoteBoards(localBoards, remoteBoards, syncMeta);

// deletion candidates are confirmed per-id (fresh /board/byids read) before deletion
await dispatch(applyRemoteChangesToState({ ... }));

// Phase 2: pushLocalChangesToApi calls getState() internally,
// reading post-PULL state. This is intentional.
await dispatch(pushLocalChangesToApi(remoteBoards));
```

`classifyRemoteBoards` uses the **pre-PULL** snapshot so its classification is not contaminated by boards PULL just added. `pushLocalChangesToApi` reads the **post-PULL** state via `getState()` internally, ensuring boards added/updated during PULL are visible.

---

## 5. Phase 1 — PULL

### 5.1 `classifyRemoteBoards(localBoards, remoteBoards, syncMeta)`

**File:** `src/components/Board/Board.utils.js:78-116`

Compares the **sync manifest** (`{ id, lastEdited }` entries) against local state and returns three lists. Each `boardsToAdd` / `boardsToUpdate` element is the lightweight manifest entry — its full body is fetched in PULL (see 5.2):

| Output             | Condition                                                                                                                                | Description                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `boardsToAdd`      | Manifest board ID not found in local boards                                                                                              | New board on the server — never seen locally.                                      |
| `boardsToUpdate`   | `moment(remote.lastEdited).isAfter(local.lastEdited)`                                                                                    | Server has a newer version. Remote wins (last-write-wins).                         |
| `boardIdsToVerify` | Local board has a server ID (`>= 14 chars`) AND is not in the manifest AND is not locally marked as deleted AND has a `syncMeta` entry   | Candidate for server-side deletion — confirmed per-id before any local delete (see below). |

> **`lastEdited` is the freshness contract.** Updates are detected solely by comparing timestamps. The engine never re-pulls a board whose `lastEdited` hasn't advanced, so every server-side board mutation **must** bump `lastEdited`, or the change will stay invisible on already-synced devices.

**Why `boardIdsToVerify` requires `localHasSyncStatus`:** Only boards that the sync system is already tracking are candidates for server-side deletion detection. Untracked boards (no `syncMeta` entry) are excluded to prevent false deletions of pre-existing boards that haven't been onboarded yet.

**Per-id deletion confirmation (stale-manifest guard, #2258):** absence from the manifest is never trusted on its own. `syncBoards` re-reads all `boardIdsToVerify` candidates with `POST /board/byids` (`confirmServerDeletions`, chunked to the server's 3000-id cap so an over-cap candidate list — e.g. after a server-side account cleanup — cannot 400 forever) and hard-deletes only the ids **absent from that fresh response** — deletion must be confirmed by the server for that specific id. A stale manifest snapshot (concurrent tab racing another tab's just-completed creates, or a lagging read on the server) omits a board that still exists, so the fresh read returns it and the board is kept; the next cycle's fresh manifest lists it again and the candidacy disappears. A genuinely deleted board is absent from the confirmation read too and is removed in the same cycle — this also covers an emptied account (empty manifest → every tracked server board is a candidate, all confirmed in one request). Any request failure (network error, 5xx, unexpected shape) confirms nothing for that chunk and retries next cycle: keeping a board the user deleted is recoverable; deleting a board the user just created is not. Ids that are not valid ObjectIds are never confirmed — the server filters them from the query, so their absence would prove nothing. (Note the predicate gap: candidacy uses `isServerBoard` — id ≥ 14 chars — while confirmation requires a 24-hex ObjectId, so an id passing the first but not the second would be a permanent, never-deleted candidate. Believed unreachable since real server ids are Mongo ObjectIds.) A failed confirmation request is reported via `trackSyncException` (`phase: confirmDeletions`) — a chronically failing `/board/byids` would otherwise silently disable all remote deletions. In a healthy cycle the candidate list is empty, so the confirmation costs no requests.

### 5.2 `applyRemoteChangesToState({ boardsToAdd, boardsToUpdate, boardIdsToDelete })`

**File:** `src/components/Board/Board.actions.js:579`

Applies the classified changes to Redux state in three steps. The
`boardIdsToDelete` it receives are the `boardIdsToVerify` candidates whose
deletion the server has already confirmed by id (§5.1), and the bodies for
every new/changed board are fetched in **one** request.

**Step 1 — Deletions (already confirmed):**

```
For each boardId in boardIdsToDelete:
  └── dispatch(deleteApiBoardSuccess({ id: boardId }))
      (hard delete from Redux: removes board + syncMeta)
```

Every id in this list carried the double signal: absent from the manifest AND
absent from a fresh `POST /board/byids` read.

**Step 2 — Fetch new/changed bodies in a single request:**

```
idsToFetch = [...boardsToAdd, ...boardsToUpdate].map(b => b.id)
if idsToFetch is empty → return (deletions already applied)

try:
  res = API.getBoardsByIds(idsToFetch)   ◄── POST /board/byids { ids }
  if res.data is not an Array → throw   (malformed shape = bug, surface it)
  bodiesById = Map(res.data, keyed by id)
catch:
  console.error(...) and RETURN          ◄── see failure handling below
```

`getBoardsByIds` is a **POST** (not GET) so a large id list — e.g. a fresh
device where every board is an "add" — can't blow past URL-length limits. One
request resolves every body regardless of how many boards changed; there is no
per-id `getBoard()` storm and no body-count threshold.

**Step 3 — Apply adds and updates from the fetched bodies:**

```
resolveBody(id):
  body = bodiesById.get(id) ?? null
  if !body → null                        (id missing from response → skip)
  if was SYNCED before fetch but became PENDING during fetch → null
  else → body

addedBoards = boardsToAdd.map(b => resolveBody(b.id)).filter(Boolean)
if addedBoards.length → dispatch(addBoards(addedBoards))

for each b in boardsToUpdate:
  body = resolveBody(b.id)
  if body → dispatch(updateBoard(body, fromRemote=true))
```

- `ADD_BOARDS` assigns `SYNCED` to server boards and `PENDING` to local boards.
- `updateBoard(body, fromRemote=true)` sets syncMeta status to `SYNCED`.
- **Concurrent-edit guard:** if the user marked a board `PENDING` while its body
  was being fetched, `resolveBody` returns `null` and the local edit is not
  overwritten. (Deletions in Step 1 are unaffected — they are authoritative.)
- **Missing id ⇒ skip:** a requested id absent from the response (board deleted
  in the race window between manifest and fetch) is skipped and self-heals on
  the next sync.

**Failure handling (the `catch` in Step 2):**

If the bulk body fetch fails (network, timeout, 5xx), the engine logs and
returns **without throwing**:

- Deletions (Step 1) are **already applied** and stay applied — they derive from
  the manifest, not from this fetch.
- Adds and updates are **deferred to the next sync**, never partially applied.
- The cycle is _not_ aborted, so the PUSH phase still runs and local edits can
  still upload. (A read failure usually implies writes fail too, so this mainly
  matters when reads fail but writes succeed — e.g. a read replica is down.)

A malformed response shape (not transient) still throws, surfacing a genuine
contract break rather than silently syncing garbage.

---

## 6. Phase 2 — PUSH

### 6.1 `classifyBoardsForPush({ boards, syncMeta, userEmail, userName, locale, remoteBoards, dispatch })`

**File:** `src/components/Board/Board.actions.js:623-692`

A **three-pass algorithm** that determines which boards to push and which to delete:

#### Pass 1 — Explicitly PENDING boards

```
For each board where syncMeta[id].status === PENDING && !isDeleted:
  │
  ├── Board has default/no email OR belongs to user?
  │     ├── YES: optionally transform (if default/no email)
  │     │        push { boardId, needsCreate: wasTransformed || isLocalBoard }
  │     └── NO:  skip (not user's board)
```

- **`needsCreate = true`** when the board was transformed (needs a new server identity) or has a local short ID.
- **`needsCreate = false`** when it's a server board the user owns and just edited.

#### Pass 2 — Untracked boards (no syncMeta entry)

See [Section 7](#7-untracked-boards-onboarding-pre-existing-boards) for the full explanation.

#### Pass 3 — Boards marked for deletion

```
For each board where syncMeta[id]?.isDeleted === true:
  └── push to boardsToDelete
```

Only boards explicitly marked via user action (which triggers `DELETE_BOARD` → sets `isDeleted: true` in `syncMeta`) are included. This prevents accidental deletions.

**Return value:** `{ boardsToSync: [{ boardId, needsCreate }], boardsToDelete: [board] }`

> **Important:** The function returns `boardId` + `needsCreate` tuples, **not** board objects. This is intentional — the PUSH loop re-reads each board from fresh state before making the API call, preventing stale references from prior iterations that may have mutated state.

### 6.2 `pushLocalChangesToApi(remoteBoards)`

**File:** `src/components/Board/Board.actions.js:703-776`

Executes the classified push operations:

#### Create/Update Loop

```
For each { boardId, needsCreate } in boardsToSync:
  │
  ├── board = getState().board.boards.find(b => b.id === boardId)
  │   (re-read from fresh state to avoid stale references)
  │
  ├── if board not found → skip (may have been deleted mid-sync)
  │
  ├── if needsCreate:
  │     ├── Ensure board is in active communicator
  │     │     └── dispatch(addBoardCommunicator(board.id))
  │     ├── dispatch(updateApiObjectsNoChild(board, true))
  │     │     └── Returns newBoardId (server-assigned)
  │     ├── dispatch(replaceBoard(board, { ...board, id: newBoardId }))
  │     └── if board was active → replaceHistoryWithActiveBoardId()
  │
  └── if !needsCreate:
        └── dispatch(updateApiBoard(board))
```

#### Delete Loop

```
For each board in boardsToDelete:
  │
  ├── if local board (short ID):
  │     └── dispatch(deleteApiBoardSuccess({ id: board.id }))
  │         (hard delete locally — nothing to delete on server)
  │
  └── if server board (long ID):
        ├── dispatch(deleteApiBoard(board.id))
        │     └── DELETE /board/{id}
        └── if 404 → dispatch(deleteApiBoardSuccess({ id: board.id }))
            (already gone from server — clean up locally)
```

---

## 7. Untracked Boards: Onboarding Pre-Existing Boards

### The Problem

Before the sync engine existed, boards were stored in Redux without any sync tracking metadata. When the sync engine is deployed, these boards have **no `syncMeta` entry**. Without special handling, the sync engine would ignore them entirely — they would never be pushed to the server or recognized as synced.

### The Solution: Pass 2 of `classifyBoardsForPush`

**File:** `src/components/Board/Board.actions.js:662-682`

Pass 2 specifically targets boards with **no `syncMeta` entry** and onboards them into the sync system. This is the migration path that ensures every board eventually gets tracked.

#### Entry Criteria

A board enters Pass 2 if **all** of the following are true:

1. `syncMeta[board.id]` is `undefined` (no tracking entry exists).
2. The board belongs to the current user (`board.email === userEmail`) **OR** it was created while unlogged (`isUnloggedCreatedBoard(board)` — no email or default email, but not a known default board).

Boards that don't meet these criteria (e.g., shared boards from other users) are left untracked and untouched.

#### Decision Logic

```
For each untracked board belonging to the user:
  │
  ├── Does a remote version exist with the same ID?
  │     │
  │     ├── YES: Is local version same age or older?
  │     │     │    (moment(local.lastEdited).isSameOrBefore(remote.lastEdited))
  │     │     │
  │     │     ├── YES → GRADUATE
  │     │     │    collect board.id into boardsToGraduate
  │     │     │    (batched: dispatch(markBoardsSynced(ids)) once at end)
  │     │     │    Effect: syncMeta[id] = { status: SYNCED }
  │     │     │    The board is now tracked. No API call needed.
  │     │     │
  │     │     └── NO → PUSH (local is newer)
  │     │          Transform if needed, then push to boardsToSync
  │     │          with needsCreate = wasTransformed || isLocalBoard
  │     │
  │     └── NO: No remote version exists
  │           └── PUSH (board only exists locally)
  │                Transform if needed, then push to boardsToSync
  │                with needsCreate = wasTransformed || isLocalBoard
```

#### Graduation vs Push

| Scenario                         | Action   | API Call?              | Resulting syncMeta                 |
| -------------------------------- | -------- | ---------------------- | ---------------------------------- |
| Remote exists and is same/newer  | Graduate | No                     | `{ status: SYNCED }`               |
| Remote exists but local is newer | Push     | Yes (create or update) | `{ status: SYNCED }` after success |
| No remote version                | Push     | Yes (create)           | `{ status: SYNCED }` after success |

#### Why Graduation Matters

Graduation is a performance optimization and correctness guarantee. Without it, every untracked board that already exists on the server with identical or newer content would be unnecessarily pushed on every sync cycle. Graduation silently onboards these boards into the tracking system with zero API calls.

Graduation only flips `syncMeta[id].status` to `SYNCED` — the board's data is unchanged (the local copy is the same age or older than the remote). For this reason it uses the dedicated `MARK_BOARDS_SYNCED` action, which batches all graduated board IDs into a single dispatch/reducer pass instead of dispatching one `UPDATE_BOARD` per board (which would also needlessly rewrite the `boards` array).

#### Transformation During Onboarding

If an untracked board has a default email (`support@cboard.io`) or no email at all, it is **transformed** before pushing:

```javascript
transformBoardForUser(board, userEmail, userName, locale);
// Sets: email → userEmail, author → userName, isPublic → false,
//        locale → user's locale, hidden → false
```

This claims ownership of default/offline boards so they appear in the user's personal board list on the server.

#### Post-Onboarding

After Pass 2 completes, every board that was untracked either:

- Has been **graduated** (now has `syncMeta` with `SYNCED` status), or
- Has been **queued for push** (will get `SYNCED` status after the API call succeeds).

On the next sync cycle, these boards will be handled by **Pass 1** (the standard PENDING tracking path) instead of Pass 2, because they now have `syncMeta` entries. Pass 2 effectively runs once per board — it's a one-time migration.

### 7.1 `syncMeta` initialization at login

`LOGIN_SUCCESS` (`Board.reducer.js`) has two branches, selected by
`discardLocalChanges = hasRemoteCommunicators` (`Login.actions.js`):

- **Discard** (user already has remote communicators): local state is replaced
  by the server boards. Only the remote (server) boards are graduated to
  `SYNCED`; the shipped defaults that aren't on the server are left untracked.
- **Merge** (no remote communicators): server boards are merged into local
  state and classified (`PENDING`/`SYNCED`); pre-existing local boards keep
  their current `syncMeta`.

**Decision:** default boards are never added to `syncMeta` at login (either
branch). They stay untracked, consistent with the merge branch and the sync
engine, which never push or track default boards. Untracked and `SYNCED` behave
identically in the UI — only `PENDING` is surfaced (see §12) — and untracked
defaults are protected from deletion by their short ID (`localHasSyncStatus`,
§5.1). A default board only enters `syncMeta` once the user edits it (→
`PENDING`), at which point it is transformed and pushed.

---

## 8. `updateApiObjectsNoChild()` Deep Dive

**File:** `src/components/Board/Board.actions.js:992-1039`

This function creates or updates a single board on the server and handles **all cascading side effects** related to ID changes and communicator consistency. Despite its name, it does significantly more than a simple API call.

### Parameters

| Parameter           | Type    | Description                                                       |
| ------------------- | ------- | ----------------------------------------------------------------- |
| `parentBoard`       | Object  | The board to create or update.                                    |
| `createParentBoard` | Boolean | `true` → POST (create), `false` → PUT (update). Default: `false`. |

### Execution Flow

```
updateApiObjectsNoChild(board, createParentBoard)
  │
  ├── 1. API Call
  │     action = createParentBoard ? createApiBoard : updateApiBoard
  │     dispatch(action(board, board.id))
  │     └── Returns { id: updatedParentBoardId, ... }
  │
  ├── 2. ID Change Handling (if local ID → server ID)
  │     │
  │     ├── replaceBoardCommunicator(oldId, newId)
  │     │     Swaps the board ID in the active communicator's board list
  │     │
  │     └── replaceDefaultHomeBoardIfIsNescesary(oldId, newId)
  │           Updates home board reference in defaultBoardsIncluded
  │           if the created board was the home board
  │
  ├── 3. Communicator Root Board Check
  │     │
  │     └── if comm.rootBoard === oldId:
  │           comm.rootBoard = newId
  │           comm.activeBoardId = newId
  │           dispatch(upsertCommunicator(comm))
  │
  ├── 4. Persist Communicator to API
  │     dispatch(upsertApiCommunicator(comm))
  │
  └── 5. Cascade: updateApiMarkedBoards()
        └── Returns updatedParentBoardId
```

### Side Effects Inventory

| #   | Side Effect                                | Trigger              | Description                                                                                                                    |
| --- | ------------------------------------------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Board created/updated on API**           | Always               | The primary API call (POST or PUT).                                                                                            |
| 2   | **Communicator board list updated**        | ID changed           | `replaceBoardCommunicator` swaps old → new ID in the communicator's `boards` array.                                            |
| 3   | **Home board reference updated**           | ID changed           | `replaceDefaultHomeBoardIfIsNescesary` ensures the default home board setting points to the new ID.                            |
| 4   | **Communicator root/active board updated** | Board was root board | If the created board was the communicator's root board, both `rootBoard` and `activeBoardId` are updated to the new server ID. |
| 5   | **Communicator persisted to API**          | Always               | `upsertApiCommunicator` pushes the communicator state to the server regardless of whether it changed.                          |
| 6   | **Marked boards cascade**                  | Always               | `updateApiMarkedBoards()` processes any boards flagged during the `CREATE_API_BOARD_SUCCESS` reducer (see 8.1).                |

### 8.1 The `CREATE_API_BOARD_SUCCESS` Reducer Cascade

**File:** `src/components/Board/Board.reducer.js:363-431`

When `createApiBoard` succeeds, the reducer does more than update the created board. It scans **all boards** for tiles that reference the old (local) board ID via `tile.loadBoard` and triggers a cascade:

```
CREATE_API_BOARD_SUCCESS reducer:
  │
  ├── Pass 1: Identify affected tiles and boards
  │     For every tile where tile.loadBoard === oldBoardId:
  │       ├── If parent is a server board → mark tile for update
  │       └── If parent is a local board → mark parent for creation
  │
  ├── Pass 2: Update tile references
  │     tile.loadBoard = newBoardId (server-assigned)
  │     If parent is server board → set markToUpdate = true
  │
  ├── Pass 3: Flag local parents
  │     If parent board has no tiles already on server
  │       → set shouldCreateBoard = true
  │
  └── Update syncMeta:
        Remove syncMeta[oldId]
        If the just-created board still has an unsynced child reference
          → Set syncMeta[newId] = { status: PENDING }   (retry next sync)
        else
          → Set syncMeta[newId] = { status: SYNCED }
```

#### Graduation guard (issue #2218)

The just-created board is **not** graduated to `SYNCED` if it still holds an
**unsynced child reference** — a `tile.loadBoard` pointing at a local child that
has not been created on the server yet (`hasUnsyncedChildReference`). Marking it
`SYNCED` would lock in a dangling short id on the server: the parent's copy would
reference a board id that was never persisted.

Instead the board is kept `PENDING` so the next sync run re-pushes it once the
child has a server id and the reference has been rewritten. The same guard is
applied in `UPDATE_API_BOARD_SUCCESS`. The CREATE path matters in particular for
**transformed default boards**: modifying a default board transforms it to a user
board and *creates* it on the server, so it graduates here rather than on the
update path.

> Default boards are excluded from the check — they are intentionally never
> pushed (kept local with short ids), so a link to one is not a pending reference
> and must not trap the parent in `PENDING`.

### 8.2 `updateApiMarkedBoards()`

**File:** `src/components/Board/Board.actions.js:1040-1089`

Processes the flags set by the `CREATE_API_BOARD_SUCCESS` reducer:

```
For each board in state:
  │
  ├── if markToUpdate === true && isServerBoard && has email === user's:
  │     dispatch(updateApiBoard(board))
  │     dispatch(unmarkBoard(board.id))
  │
  └── if shouldCreateBoard === true && isLocalBoard:
        Transform board for user
        Remove shouldCreateBoard flag
        dispatch(updateApiObjectsNoChild(boardData, true))  ← RECURSIVE
        dispatch(replaceBoard(oldBoard, { ...board, id: newId }))
```

**This is recursive:** `updateApiMarkedBoards` calls `updateApiObjectsNoChild`, which calls `updateApiMarkedBoards` again. This recursion continues until no more boards are marked, naturally handling deeply nested board hierarchies where creating one board reveals that its parent also needs creating.

---

## 9. Board Identity Model

### ID-Based Classification

```
Board ID length < 14 chars  →  LOCAL board (shortid-generated)
Board ID length >= 14 chars →  SERVER board (MongoDB ObjectId)
```

**Constant:** `SHORT_ID_MAX_LENGTH = 14` (`src/components/Board/Board.constants.js:48`)

### Board Type Decision Tree

```
Is board.id in DEFAULT_BOARD_IDS set AND email === "support@cboard.io"?
  ├── YES → Default Board (app-shipped template)
  └── NO
        ├── Has no email OR email === "support@cboard.io"?
        │     └── YES → Unlogged-Created Board (created while offline/unauthenticated)
        │
        ├── email === current user's email?
        │     └── YES → User's Board
        │
        └── Otherwise → Other user's board (not synced by this user)
```

### Utility Functions

**File:** `src/components/Board/Board.utils.js`

| Function                                            | Logic                                              | Used By                                          |
| --------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------ |
| `isLocalBoard(board)`                               | `board.id.length < 14`                             | Push classification, reducer, marked boards      |
| `isServerBoard(board)`                              | `board.id.length >= 14`                            | Pull classification, delete logic, marked boards |
| `isDefaultBoard(board)`                             | ID in known set AND default email                  | Unlogged board detection                         |
| `hasDefaultOrNoEmail(board)`                        | `!email \|\| email === "support@cboard.io"`        | Transform decision                               |
| `isUnloggedCreatedBoard(board)`                     | `!isDefaultBoard && hasDefaultOrNoEmail`           | Pass 2 classification                            |
| `hasUnsyncedChildReference(board, boards)`          | `true` if any `tile.loadBoard` points at a local, non-default board still present in `boards` (i.e. a child not yet on the server) | Graduation guard in `CREATE_API_BOARD_SUCCESS` and `UPDATE_API_BOARD_SUCCESS` |
| `transformBoardForUser(board, email, name, locale)` | Sets email, author, name, isPublic, locale, hidden | Onboarding default/offline boards                |

### `transformBoardForUser` Output

```javascript
{
  ...board,
  email: userEmail,              // Claims ownership
  author: userName || userEmail,  // Sets author
  name: extractBoardName(board),  // Preserves or extracts from nameKey
  isPublic: false,                // Private by default
  locale: locale,                 // User's language
  hidden: false                   // Ensures visibility
}
```

---

## 10. State Management

### 10.1 Redux State Shape

```javascript
state.board = {
  boards: Board[],          // All board objects
  syncMeta: {               // Sync tracking metadata
    [boardId]: {
      status: 'synced' | 'pending',
      isDeleted?: boolean
    }
  },
  activeBoardId: string,    // Currently displayed board
  navHistory: string[],     // Board navigation stack
  isFetching: boolean,      // API call in progress
  isSyncing: boolean,       // Sync engine running
  syncError: string | null, // Last sync error
  output: [],
  images: [],
  isFixed: boolean,
  isLiveMode: boolean,
  improvedPhrase: string
}
```

### 10.2 `syncMeta` Lifecycle

The `syncMeta` object tracks each board's sync status. Here's how every reducer action affects it:

| Action                     | syncMeta Effect                                     | Trigger                                                   |
| -------------------------- | --------------------------------------------------- | --------------------------------------------------------- |
| `ADD_BOARDS`               | `[id]: { status: isLocalBoard ? PENDING : SYNCED }` | Pull adds remote boards, or boards added programmatically |
| `CREATE_BOARD`             | `[id]: { status: PENDING }`                         | User creates a new board                                  |
| `UPDATE_BOARD`             | `[id]: { status: fromRemote ? SYNCED : PENDING }`   | Local edit (PENDING) or remote pull (SYNCED)              |
| `MARK_BOARDS_SYNCED`       | For each id: `[id]: { status: SYNCED }` (batched)   | Graduation of untracked boards (Pass 2, no data change)  |
| `DELETE_BOARD`             | `[id]: { status: PENDING, isDeleted: true }`        | User deletes a board (soft delete)                        |
| `CREATE_TILE`              | `[boardId]: { status: PENDING }`                    | Tile added to board                                       |
| `DELETE_TILES`             | `[boardId]: { status: PENDING }`                    | Tiles removed from board                                  |
| `EDIT_TILES`               | `[boardId]: { status: PENDING }`                    | Tiles modified on board                                   |
| `CREATE_API_BOARD_SUCCESS` | Remove `[oldId]`, set `[newId]: { status: SYNCED }` — but `PENDING` if the board still has an unsynced child reference (#2218) | Board successfully created on server                      |
| `UPDATE_API_BOARD_SUCCESS` | `[id]: { status: SYNCED }` — but `PENDING` if the board still has an unsynced child reference (#2218) | Board successfully updated on server                      |
| `DELETE_API_BOARD_SUCCESS` | Remove `[id]` entirely                              | Board removed from server (hard delete)                   |
| `REPLACE_BOARD`            | Migrate `[prevId]` → `[currentId]`                  | Board ID swapped (local → server)                         |
| `LOGOUT`                   | Reset to `{}`                                       | User logs out                                             |

### 10.3 State Transitions Diagram

```
                    ┌─────────────────────┐
    Board created   │                     │  Board pulled from
    or edited       │      PENDING        │  server (fromRemote)
   ┌───────────────▶│                     │◀─────────────────┐
   │                └──────────┬──────────┘                  │
   │                           │                             │
   │                  API call succeeds                      │
   │                  (CREATE or UPDATE)                     │
   │                           │                             │
   │                           ▼                             │
   │                ┌─────────────────────┐                  │
   │                │                     │                  │
   │                │      SYNCED         │──────────────────┘
   │                │                     │   Remote update
   └────────────────│                     │   arrives
                    └──────────┬──────────┘
                Local edit     │
                               │  User deletes board
                               ▼
                    ┌─────────────────────┐
                    │  PENDING            │
                    │  isDeleted: true    │
                    └──────────┬──────────┘
                               │
                      API DELETE succeeds
                               │
                               ▼
                    ┌─────────────────────┐
                    │  (removed from      │
                    │   syncMeta entirely)│
                    └─────────────────────┘
```

---

## 11. Sync Lifecycle Catalog

This section documents each trigger point where board synchronization occurs.
Add new subsections as new lifecycle integrations are implemented.

All triggers funnel through `App.container.js → handleDataRefresh(source)`,
which is guarded by: logged-in, online, and a **30-second throttle**
(`THROTTLE_MS`, bypassed when there are pending local sync boards). When it
passes, it dispatches `getApiObjects() → getApiMyBoards() → syncBoards(manifest)`.

### 11.1 Sync triggers

| Trigger             | Event                                  | `source` label        |
| ------------------- | -------------------------------------- | --------------------- |
| App start           | `componentDidMount`                    | `App started`         |
| Tab focused         | `visibilitychange` (web)               | `Tab focused`         |
| Connection restored | `online` event                        | `Connection restored` |
| App resumed         | Cordova `onCvaResume`                  | `App resumed`         |
| Manual sync         | `SyncButton` → `getApiObjects()`       | (component)           |

- **Scope:** Every trigger runs the **same full manifest reconciliation** — the
  complete board list is compared via `getBoardsSync()`, then only new/changed
  bodies are fetched and only PENDING boards are pushed.
- **Important:** there is **no** request that re-downloads all board _bodies_ on
  a routine sync. A full-body download only happens implicitly on a fresh
  device / first login, where every manifest entry classifies as an add and
  `getBoardsByIds()` fetches them all in one request. Steady-state syncs transfer
  only deltas. This is by design — the manifest is the "full pull"; bodies follow
  for changes only.

<!--
### 11.X [Template for new lifecycles]

- **Trigger:** [What user action or system event starts the sync]
- **Flow:** [Chain of function calls from trigger to syncBoards]
- **Scope:** [Full sync / partial / specific boards]
- **UI Feedback:** [What the user sees during this sync]
- **Notes:** [Edge cases, timing constraints, debouncing, etc.]
-->

---

## 12. UI State Mapping

This section maps the sync engine's internal state to user-facing UI indicators.
Use this as the contract between the engine and the presentation layer.

### Available State Signals

| State                | Source                                | Value                                   |
| -------------------- | ------------------------------------- | --------------------------------------- |
| Sync in progress     | `state.board.isSyncing`               | `true` while `syncBoards()` is running  |
| Sync error           | `state.board.syncError`               | Error message string, or `null`         |
| Board pending        | `state.board.syncMeta[id]?.status`    | `'pending'` — has unsaved local changes |
| Board synced         | `state.board.syncMeta[id]?.status`    | `'synced'` — matches server             |
| Board pending delete | `state.board.syncMeta[id]?.isDeleted` | `true` — queued for server deletion     |
| Board untracked      | `state.board.syncMeta[id]`            | `undefined` — not yet onboarded         |
| API call active      | `state.board.isFetching`              | `true` during individual API calls      |
| Single board saving  | `state.board.isSaving`                | `true` during an individual create/update API call |
| Any board pending    | `hasPendingSyncBoards(state)`         | `true` if any board's `syncMeta` status is `pending` |
| Online               | `state.app.isConnected`               | `true` when the device has connectivity  |

### Implemented UI Mapping

The `SyncButton` component
(`src/components/Communicator/CommunicatorToolbar/SyncButton/SyncButton.js`)
collapses the signals above into a single **display state**. It first derives a
coarse sync status, then maps it (plus connectivity) to what the user sees.

**Derived sync status** (`getSyncStatus`):

| Sync status | Condition                                |
| ----------- | ---------------------------------------- |
| `SYNCING`   | `isSyncing \|\| isFetching \|\| isSaving` |
| `PENDING`   | `hasPendingBoards`                       |
| `SYNCED`    | otherwise                                |

**Display state** (`getDisplayState`, evaluated top-down — first match wins):

| User sees                       | Display state    | Condition                              | Icon              |
| ------------------------------- | ---------------- | -------------------------------------- | ----------------- |
| "Working Offline" (amber)       | `workingOffline` | `!isOnline && hasPendingBoards`        | `OfflinePin`      |
| "Offline" (amber)               | `offline`        | `!isOnline`                            | `CloudOff`        |
| Spinner                         | `saving`         | `syncStatus === SYNCING`               | `CircularProgress`|
| "Saved Locally" (amber)         | `savedLocally`   | `syncStatus === PENDING`               | `SyncProblem`     |
| Checkmark (green)               | `synced`         | otherwise                              | `CloudDone`       |

**Notes:**

- The indicator is **global**, not per-board — it reflects whether _any_ board is
  pending (`hasPendingSyncBoards`), not the active board's status.
- Manual sync: the `savedLocally` and `saving` states are clickable and dispatch
  `getApiObjects()`; clicking is disabled while `SYNCING`. The offline states are
  non-interactive.
- `syncError` is **not** currently surfaced by `SyncButton` — a failed sync falls
  back to `savedLocally` (boards remain `PENDING`) once syncing stops.

---

## 13. Sync Status Flow Diagram

### Complete Lifecycle

```
USER ACTION (edit board / create tile / delete board)
       │
       ▼
  Redux Reducer marks syncMeta[boardId] = PENDING
       │
       ▼
  [Later] App trigger → getApiMyBoards()
       │
       ▼
  API.getBoardsSync()  ─── { id, lastEdited } manifest (all boards)
       │
       ▼
  syncBoards(manifest) ─── dispatches SYNC_BOARDS_STARTED
       │
       ├──────────────── PHASE 1: PULL ────────────────┐
       │                                                │
       │  classifyRemoteBoards(local, manifest, syncMeta)│
       │       │                                        │
       │       ├── boardsToAdd (new on server)          │
       │       ├── boardsToUpdate (server is newer)     │
       │       └── boardIdsToVerify (absent from manifest)│
       │             └── fresh /board/byids read confirms│
       │                                                │
       │  applyRemoteChangesToState()                   │
       │       ├── delete confirmed-deleted boards      │
       │       ├── API.getBoardsByIds(new+changed ids)  │
       │       │     (single POST /board/byids)         │
       │       ├── addBoards → syncMeta = SYNCED        │
       │       └── updateBoard(fromRemote) → SYNCED     │
       │                                                │
       ├──────────────── PHASE 2: PUSH ────────────────┐
       │                                                │
       │  classifyBoardsForPush()                       │
       │       ├── Pass 1: PENDING boards               │
       │       ├── Pass 2: Untracked boards (onboard)   │
       │       └── Pass 3: Deleted boards               │
       │                                                │
       │  pushLocalChangesToApi()                       │
       │       ├── needsCreate → updateApiObjectsNoChild│
       │       │     └── side effects cascade           │
       │       ├── !needsCreate → updateApiBoard        │
       │       └── deletions → deleteApiBoard           │
       │                                                │
       ▼
  SYNC_BOARDS_SUCCESS (or SYNC_BOARDS_FAILURE)
       │
       ▼
  All boards now have syncMeta = SYNCED
  (except any that failed — remain PENDING for next cycle)
```

---

## 14. Error Handling & Edge Cases

### Error Recovery

| Scenario                            | Handling                                                                                 | Location                   |
| ----------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------- |
| `syncBoards()` throws               | Catches error, dispatches `SYNC_BOARDS_FAILURE`, returns `{ success: false }`            | `Board.actions.js:848`     |
| Bulk body fetch fails (PULL)        | `console.error`, **returns without throwing**. Deletions stay applied; adds/updates deferred to next sync; PUSH still runs. | `Board.actions.js:605`     |
| Bulk body fetch returns bad shape   | Throws `'Bulk board fetch returned an unexpected shape'` — surfaces a contract break.    | `Board.actions.js:597`     |
| Board absent from manifest          | Deletion candidate — hard deleted only when a fresh `POST /board/byids` read also omits it (server confirms by id). Any request failure keeps the board for the next cycle. | `Board.actions.js` → `syncBoards` / `confirmServerDeletions` |
| Requested id missing from body fetch | Skipped (board deleted in race window); self-heals on next sync.                        | `Board.actions.js:579`     |
| Individual board push fails         | `console.error`, continues to next board. Failed board remains `PENDING` for next sync.  | `Board.actions.js:783`     |
| Board push returns 404              | The board was deleted on the server (another device / web / account op) — hard delete locally via `deleteApiBoardSuccess` so it stops re-pushing forever. Only when the board is **also absent from this cycle's manifest AND a fresh `POST /board/byids` read also omits it** (a PUT 404 that either contradicts the manifest or isn't reproduced by the fresh read is treated as transient — no delete). Covers untracked zombies and the edit-vs-delete conflict: delete wins once the server confirms by id. | `Board.actions.js` push-loop catch |
| Board delete fails with non-404     | `console.error`, continues. Board remains marked `isDeleted` for next sync.              | `Board.actions.js:803`     |
| Board delete fails with 404         | Treated as success — board already gone from server. Dispatches `deleteApiBoardSuccess`. | `Board.actions.js:799-800` |
| 403 from any API call               | Axios interceptor triggers automatic logout.                                             | Global API config          |
| No `userEmail` in state             | `pushLocalChangesToApi` returns immediately — no push occurs.                            | `Board.actions.js:733`     |

### Known Edge Cases

| Edge Case                                        | Impact                                                                                                                         | Mitigation                                                                                                                 |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| **ID-length heuristic**                          | A locally-generated ID that happens to be >= 14 chars would be misclassified as a server board.                                | `shortid` output is typically 7-12 chars, making collision extremely unlikely.                                             |
| **`moment.js` timestamp precision**              | Two edits within the same second could have identical `lastEdited` values, causing `isAfter` to return false.                  | `isSameOrBefore` in graduation uses inclusive comparison. Last-write-wins is acceptable for the conflict resolution model. |
| **Concurrent edit during body fetch**            | User edits a board (SYNCED→PENDING) while `applyRemoteChangesToState` is fetching its body for an add/update.                  | `resolveBody` compares pre/post-fetch `syncMeta`; on a SYNCED→PENDING transition it returns `null` and skips the overwrite, preserving the local edit.       |
| **Stale `lastEdited` on the server**             | A board body changes server-side without bumping `lastEdited`.                                                                 | Not detected — the manifest comparison sees no change and never re-pulls. The freshness model depends on every write bumping `lastEdited` (see §5.1).       |
| **`updateApiObjectsNoChild` recursive cascade**  | `updateApiMarkedBoards` → `updateApiObjectsNoChild` → `updateApiMarkedBoards` can recurse for deeply nested board hierarchies. | Recursion terminates naturally when no more boards are marked. Assumes finite board hierarchy depth.                       |
| **Stale board references in push loop**          | A prior iteration's API call may change board IDs in state via `CREATE_API_BOARD_SUCCESS`.                                     | The push loop re-reads each board from `getState()` before every API call.                                                 |
| **Parent pushed before its local child ** | A parent can reach the server with a `tile.loadBoard` pointing at a local short id (e.g. an offline-created folder, or a folder added to a default board) — a dangling reference if the child create is later lost. | `hasUnsyncedChildReference` holds the parent `PENDING` (in both `CREATE_API_BOARD_SUCCESS` and `UPDATE_API_BOARD_SUCCESS`) instead of graduating it to `SYNCED`, so it is re-pushed once the child has a server id. Fully ordering children before parents in the push loop is tracked under the resilience epic (#2195). |
| **Untracked server board deleted remotely (zombie)** | A pre-sync-engine board persisted with a server id but **no `syncMeta`** (untracked, see §7) that was deleted on the server out-of-band is absent from the manifest. PULL never deletes it (the `localHasSyncStatus` guard, §5.1), so Pass 2 keeps pushing it via PUT every sync forever. | On a `404` from the push PUT of a board that is **also absent from this cycle's manifest and that a fresh `POST /board/byids` read also omits**, hard delete it locally (`deleteApiBoardSuccess`). Safe because the deletion is confirmed by the server for that specific id. |
| **Stale manifest vs. just-created boards (#2258)** | A sync cycle (typically a second browser tab sharing redux-persist state) can classify against a manifest snapshot that does not yet list boards another cycle just created; those boards are SYNCED + server-id, so the four candidate conditions hold and they were hard-deleted locally. | Per-id deletion confirmation: a candidate is deleted only when a fresh `POST /board/byids` read omits it. A board omitted by a stale snapshot still exists, so the fresh read returns it and the board is kept (see §5.1). |
| **Communicator always persisted**                | `upsertApiCommunicator` is called even when the communicator didn't change.                                                    | No functional impact, but causes unnecessary API calls.                                                                    |

---

## 15. File Reference Table

| Component                 | Path                                      | Key Lines                                                                                                                                                                                                    |
| ------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Actions (sync engine)** | `src/components/Board/Board.actions.js`   | `syncBoards` (817), `applyRemoteChangesToState` (579), `classifyBoardsForPush` (654), `pushLocalChangesToApi` (734), `updateApiObjectsNoChild` (1027), `updateApiMarkedBoards` (1075), `getApiMyBoards` (532) |
| **Utilities**             | `src/components/Board/Board.utils.js`     | `classifyRemoteBoards` (78), `isLocalBoard` (26), `isServerBoard` (27), `transformBoardForUser` (60), `isUnloggedCreatedBoard` (32), `hasDefaultOrNoEmail` (29), `isDefaultBoard` (23)                       |
| **Reducer**               | `src/components/Board/Board.reducer.js`   | `syncMeta` handling throughout, `CREATE_API_BOARD_SUCCESS` cascade (363), `SYNC_BOARDS_*` (521-537)                                                                                                          |
| **Constants**             | `src/components/Board/Board.constants.js` | `SYNC_STATUS` (50), `SHORT_ID_MAX_LENGTH` (48), `DEFAULT_BOARD_EMAIL` (55)                                                                                                                                   |
| **API**                   | `src/api/api.js`                          | `getBoardsSync` (280, `GET /board/sync/:email` manifest), `getBoardsByIds` (262, `POST /board/byids`), `getMyBoards`, `getBoard`, `createBoard`, `updateBoard`, `deleteBoard`                                 |
| **Sync triggers**         | `src/components/App/App.container.js`     | `handleDataRefresh` (142), trigger handlers (171-185), `THROTTLE_MS` (138)                                                                                                                                   |
| **Container**             | `src/components/Board/Board.container.js` | `getApiObjects` dispatch on mount                                                                                                                                                                            |
