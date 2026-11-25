import { useCallback } from 'react';
import API from '../../../../api';
import { SECTIONS } from '../CommunicatorDialog.constants';
import messages from '../CommunicatorDialog.messages';
import { moveVisibleBoard } from '../utils/quickAccessOrder';
import { isLoggedIn } from '../utils/userData';

/**
 * Membership of boards in the active communicator: adding, removing, choosing
 * the root board and reordering. Every write goes through
 * persistCommunicatorBoardIds so the local upsert and the API upsert stay in
 * one place.
 */
const useCommunicatorBoards = ({
  section,
  intl,
  userData,
  currentCommunicator,
  availableBoards,
  addBoards,
  verifyAndUpsertCommunicator,
  upsertApiCommunicator,
  showNotification,
  refetch
}) => {
  const persistCommunicatorBoardIds = useCallback(
    async (boardIds) => {
      const updatedCommunicatorData = {
        ...currentCommunicator,
        boards: boardIds
      };
      const upsertedCommunicator = verifyAndUpsertCommunicator(
        updatedCommunicatorData
      );
      if (isLoggedIn(userData)) {
        try {
          await upsertApiCommunicator(upsertedCommunicator);
        } catch (err) {
          console.error('Error upserting communicator', err);
        }
      }
    },
    [
      currentCommunicator,
      userData,
      verifyAndUpsertCommunicator,
      upsertApiCommunicator
    ]
  );

  /**
   * My Boards and Community list boards straight from the API, but the tray
   * and the board view only resolve boards that are in the local store. Pull
   * in any board that just joined the communicator so it can be shown.
   */
  const ensureBoardIsLocal = useCallback(
    async (board) => {
      if (availableBoards.findIndex((b) => b.id === board.id) >= 0) {
        return;
      }
      const boards = [];
      try {
        const boardData = await API.getBoard(board.id);
        boards.push(boardData);
      } catch (e) {}
      addBoards(boards);
    },
    [availableBoards, addBoards]
  );

  const addOrRemoveFromCommunicator = useCallback(
    async (board) => {
      const currentIds = currentCommunicator.boards;
      const isMember = currentIds.includes(board.id);
      const nextIds = isMember
        ? currentIds.filter((id) => id !== board.id)
        : [...currentIds, board.id];

      showNotification(
        intl.formatMessage(
          isMember
            ? messages.boardRemovedFromCommunicator
            : messages.boardAddedToCommunicator
        )
      );

      await persistCommunicatorBoardIds(nextIds);

      if (!isMember) {
        await ensureBoardIsLocal(board);
      }
    },
    [
      currentCommunicator,
      persistCommunicatorBoardIds,
      ensureBoardIsLocal,
      showNotification,
      intl
    ]
  );

  const addOrRemoveBoard = useCallback(
    async (board) => {
      if (section === SECTIONS.MY_COMMUNICATOR) {
        await persistCommunicatorBoardIds(
          currentCommunicator.boards.filter((id) => id !== board.id)
        );
        refetch();
        return;
      }
      await addOrRemoveFromCommunicator(board);
    },
    [
      section,
      currentCommunicator,
      persistCommunicatorBoardIds,
      addOrRemoveFromCommunicator,
      refetch
    ]
  );

  /**
   * Home can be set from My Boards on a board that is not in Quick access yet.
   * The root must always be a member of the communicator: the tray only lists
   * member boards, and the add-to-Quick-access action is disabled for the
   * root, so a non-member root could never be added afterwards.
   */
  const setRootBoard = useCallback(
    async (board) => {
      const currentIds = currentCommunicator.boards;
      const updatedCommunicatorData = {
        ...currentCommunicator,
        rootBoard: board.id,
        boards: currentIds.includes(board.id)
          ? currentIds
          : [...currentIds, board.id]
      };
      const upsertedCommunicator = verifyAndUpsertCommunicator(
        updatedCommunicatorData
      );
      try {
        if (isLoggedIn(userData)) {
          await upsertApiCommunicator(upsertedCommunicator);
        }
      } catch (err) {
        console.error('Error upserting communicator', err);
      }
      await ensureBoardIsLocal(board);
    },
    [
      currentCommunicator,
      userData,
      verifyAndUpsertCommunicator,
      upsertApiCommunicator,
      ensureBoardIsLocal
    ]
  );

  /**
   * Moves a board one slot up (delta -1) or down (delta 1) among the ids the
   * tray is actually showing, leaving ids with no visible board untouched at
   * their current index. Skips the write entirely when the move is a no-op.
   */
  const reorderCommunicatorBoards = useCallback(
    async (boardId, delta, visibleIds) => {
      const currentIds = currentCommunicator.boards;
      const nextIds = moveVisibleBoard(currentIds, visibleIds, boardId, delta);
      if (nextIds === currentIds) {
        return;
      }
      await persistCommunicatorBoardIds(nextIds);
    },
    [currentCommunicator, persistCommunicatorBoardIds]
  );

  return {
    addOrRemoveBoard,
    setRootBoard,
    reorderCommunicatorBoards
  };
};

export default useCommunicatorBoards;
