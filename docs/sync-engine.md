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

---

## 2. Overview

The sync engine implements a **two-phase, PULL-then-PUSH** strategy:

```
Server (API)                          Local (Redux)
     │                                      │
     │  ┌──────────────────────────────┐    │
     │  │  Phase 1: PULL               │    │
     │──┤  Remote → Local              │───▶│  Apply additions, updates,
     │  │  classifyRemoteBoards()      │    │  and verified deletions
     │  │  applyRemoteChangesToState() │    │
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
**File:** `src/components/Board/Board.actions.js:530`

```
Board component mounts (logged in + online)
       │
       ▼
  getApiObjects()
       │
       ▼
  getApiMyBoards()
       │
       ├── dispatch(getApiMyBoardsStarted())
       ├── API.getMyBoards({ limit: 500 })
       ├── dispatch(getApiMyBoardsSuccess(res))
       │
       └── if res.data is Array:
              dispatch(syncBoards(res.data))   ◄── triggers the engine
```

The remote boards array (`res.data`) is passed directly to `syncBoards()` as the authoritative server state snapshot.

---

## 4. Orchestrator: `syncBoards()`

**File:** `src/components/Board/Board.actions.js:782-822`

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
const { boardsToAdd, boardsToUpdate, boardIdsToDelete } =
  classifyRemoteBoards(localBoards, remoteBoards, syncMeta);

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

Compares the server snapshot against local state and returns three lists:

| Output             | Condition                                                                                                                                | Description                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `boardsToAdd`      | Remote board ID not found in local boards                                                                                                | New board from server — never seen locally.                                        |
| `boardsToUpdate`   | `moment(remote.lastEdited).isAfter(local.lastEdited)`                                                                                    | Server has a newer version. Remote wins (last-write-wins).                         |
| `boardIdsToDelete` | Local board has a server ID (`>= 14 chars`) AND is not in the remote set AND is not locally marked as deleted AND has a `syncMeta` entry | Board appears to have been deleted on the server. Requires verification (see 5.2). |

**Why `boardIdsToDelete` requires `localHasSyncStatus`:** Only boards that the sync system is already tracking are candidates for server-side deletion detection. Untracked boards (no `syncMeta` entry) are excluded to prevent false deletions of pre-existing boards that haven't been onboarded yet.

### 5.2 `applyRemoteChangesToState({ boardsToAdd, boardsToUpdate, boardIdsToDelete })`

**File:** `src/components/Board/Board.actions.js:568-613`

Applies the classified changes to Redux state:

**Additions:**

```
dispatch(addBoards(boardsToAdd))
```

The `ADD_BOARDS` reducer assigns `SYNCED` status to server boards and `PENDING` to local boards.

**Updates:**

```
dispatch(updateBoard(board, fromRemote=true))
```

The `fromRemote=true` flag causes the reducer to set syncMeta status to `SYNCED`.

**Deletions — Verification Protocol:**

Boards that appear deleted on the server are **not immediately removed**. Instead, each is individually verified:

```
For each boardId in boardIdsToDelete:
  │
  ├── GET /board/{boardId}
  │
  ├── If 404 → Board confirmed deleted on server
  │      └── dispatch(deleteApiBoardSuccess({ id: boardId }))
  │          (hard delete from Redux: removes board + syncMeta)
  │
  ├── If board returned → Board still exists on server
  │      ├── Check: was SYNCED before fetch but became PENDING during fetch?
  │      │     └── YES: User edited while verifying → skip (don't overwrite)
  │      │     └── NO:  Update local with server version
  │      └── dispatch(updateBoard(res, fromRemote=true))
  │
  └── If other error → Log and skip
```

This verification prevents data loss when:

- The API's paginated response omits a board (pagination edge case).
- A concurrent edit occurred between fetching the board list and processing deletions.

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
  │     │     │    dispatch(updateBoard(board, fromRemote=true))
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
        Set syncMeta[newId] = { status: SYNCED }
```

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
| `DELETE_BOARD`             | `[id]: { status: PENDING, isDeleted: true }`        | User deletes a board (soft delete)                        |
| `CREATE_TILE`              | `[boardId]: { status: PENDING }`                    | Tile added to board                                       |
| `DELETE_TILES`             | `[boardId]: { status: PENDING }`                    | Tiles removed from board                                  |
| `EDIT_TILES`               | `[boardId]: { status: PENDING }`                    | Tiles modified on board                                   |
| `CREATE_API_BOARD_SUCCESS` | Remove `[oldId]`, set `[newId]: { status: SYNCED }` | Board successfully created on server                      |
| `UPDATE_API_BOARD_SUCCESS` | `[id]: { status: SYNCED }`                          | Board successfully updated on server                      |
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

### 11.1 App Mount (Login)

- **Trigger:** Board component mounts when user is logged in and online.
- **Flow:** `Board.container.js` → `getApiObjects()` → `getApiMyBoards()` → `syncBoards(res.data)`
- **Scope:** Full sync — all boards pulled and pushed.
- **Notes:** This is currently the only lifecycle where sync runs.

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

### Suggested UI Mapping

<!--
Fill in as UI is implemented. Example mapping:

| User Sees | Condition |
|-----------|-----------|
| Spinner / "Syncing..." | isSyncing === true |
| Green checkmark | syncMeta[activeBoard]?.status === 'synced' |
| Orange dot / "Unsaved" | syncMeta[activeBoard]?.status === 'pending' |
| Red banner / "Sync failed" | syncError !== null |
| No indicator | syncMeta[activeBoard] === undefined (untracked) |
-->

_To be defined when the sync status UI is implemented._

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
  [Later] App triggers getApiMyBoards()
       │
       ▼
  API.getMyBoards({ limit: 500 })
       │
       ▼
  syncBoards(remoteBoards) ─── dispatches SYNC_BOARDS_STARTED
       │
       ├──────────────── PHASE 1: PULL ────────────────┐
       │                                                │
       │  classifyRemoteBoards(local, remote, syncMeta) │
       │       │                                        │
       │       ├── boardsToAdd (new from server)        │
       │       ├── boardsToUpdate (server is newer)     │
       │       └── boardIdsToDelete (missing on server) │
       │                                                │
       │  applyRemoteChangesToState()                   │
       │       ├── addBoards → syncMeta = SYNCED        │
       │       ├── updateBoard(fromRemote) → SYNCED     │
       │       └── verify deletions → hard delete or    │
       │           update                               │
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
| `syncBoards()` throws               | Catches error, dispatches `SYNC_BOARDS_FAILURE`, returns `{ success: false }`            | `Board.actions.js:816-819` |
| Individual board push fails         | `console.error`, continues to next board. Failed board remains `PENDING` for next sync.  | `Board.actions.js:751-753` |
| Board delete fails with non-404     | `console.error`, continues. Board remains marked `isDeleted` for next sync.              | `Board.actions.js:772-773` |
| Board delete fails with 404         | Treated as success — board already gone from server. Dispatches `deleteApiBoardSuccess`. | `Board.actions.js:768-771` |
| Deletion verification returns 404   | Confirmed deleted — hard delete locally.                                                 | `Board.actions.js:600-601` |
| Deletion verification returns board | Board still exists — update locally instead of deleting.                                 | `Board.actions.js:597`     |
| 403 from any API call               | Axios interceptor triggers automatic logout.                                             | Global API config          |
| No `userEmail` in state             | `pushLocalChangesToApi` returns immediately — no push occurs.                            | `Board.actions.js:706`     |

### Known Edge Cases

| Edge Case                                        | Impact                                                                                                                         | Mitigation                                                                                                                 |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| **ID-length heuristic**                          | A locally-generated ID that happens to be >= 14 chars would be misclassified as a server board.                                | `shortid` output is typically 7-12 chars, making collision extremely unlikely.                                             |
| **`moment.js` timestamp precision**              | Two edits within the same second could have identical `lastEdited` values, causing `isAfter` to return false.                  | `isSameOrBefore` in graduation uses inclusive comparison. Last-write-wins is acceptable for the conflict resolution model. |
| **Concurrent edit during deletion verification** | User edits a board while `applyRemoteChangesToState` is verifying its deletion.                                                | Pre/post fetch `syncMeta` comparison detects the SYNCED→PENDING transition and skips the overwrite.                        |
| **`updateApiObjectsNoChild` recursive cascade**  | `updateApiMarkedBoards` → `updateApiObjectsNoChild` → `updateApiMarkedBoards` can recurse for deeply nested board hierarchies. | Recursion terminates naturally when no more boards are marked. Assumes finite board hierarchy depth.                       |
| **Stale board references in push loop**          | A prior iteration's API call may change board IDs in state via `CREATE_API_BOARD_SUCCESS`.                                     | The push loop re-reads each board from `getState()` before every API call.                                                 |
| **Communicator always persisted**                | `upsertApiCommunicator` is called even when the communicator didn't change.                                                    | No functional impact, but causes unnecessary API calls.                                                                    |

---

## 15. File Reference Table

| Component                 | Path                                      | Key Lines                                                                                                                                                                                                    |
| ------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Actions (sync engine)** | `src/components/Board/Board.actions.js`   | `syncBoards` (782), `applyRemoteChangesToState` (568), `classifyBoardsForPush` (623), `pushLocalChangesToApi` (703), `updateApiObjectsNoChild` (992), `updateApiMarkedBoards` (1040), `getApiMyBoards` (530) |
| **Utilities**             | `src/components/Board/Board.utils.js`     | `classifyRemoteBoards` (78), `isLocalBoard` (26), `isServerBoard` (27), `transformBoardForUser` (60), `isUnloggedCreatedBoard` (32), `hasDefaultOrNoEmail` (29), `isDefaultBoard` (23)                       |
| **Reducer**               | `src/components/Board/Board.reducer.js`   | `syncMeta` handling throughout, `CREATE_API_BOARD_SUCCESS` cascade (363), `SYNC_BOARDS_*` (521-537)                                                                                                          |
| **Constants**             | `src/components/Board/Board.constants.js` | `SYNC_STATUS` (50), `SHORT_ID_MAX_LENGTH` (48), `DEFAULT_BOARD_EMAIL` (55)                                                                                                                                   |
| **API**                   | `src/api/api.js`                          | `getMyBoards`, `getBoard`, `createBoard`, `updateBoard`, `deleteBoard`                                                                                                                                       |
| **Container**             | `src/components/Board/Board.container.js` | `getApiObjects` dispatch on mount                                                                                                                                                                            |
