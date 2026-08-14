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
  communicatorBoards,
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

  const updateCommunicatorBoards = useCallback(
    async (boards) => persistCommunicatorBoardIds(boards.map((cb) => cb.id)),
    [persistCommunicatorBoardIds]
  );

  const addOrRemoveFromCommunicator = useCallback(
    async (board) => {
      const nextCommunicatorBoards = [...communicatorBoards];
      const boardIndex = nextCommunicatorBoards.findIndex(
        (b) => b.id === board.id
      );
      if (boardIndex >= 0) {
        nextCommunicatorBoards.splice(boardIndex, 1);
        showNotification(
          intl.formatMessage(messages.boardRemovedFromCommunicator)
        );
      } else {
        nextCommunicatorBoards.push(board);
        showNotification(intl.formatMessage(messages.boardAddedToCommunicator));
      }

      await updateCommunicatorBoards(nextCommunicatorBoards);

      // Fetch board if it's not locally available.
      if (
        boardIndex < 0 &&
        availableBoards.findIndex((b) => b.id === board.id) < 0
      ) {
        const boards = [];
        try {
          const boardData = await API.getBoard(board.id);
          boards.push(boardData);
        } catch (e) {}
        addBoards(boards);
      }
    },
    [
      communicatorBoards,
      availableBoards,
      updateCommunicatorBoards,
      addBoards,
      showNotification,
      intl
    ]
  );

  const addOrRemoveBoard = useCallback(
    async (board) => {
      if (section === SECTIONS.MY_COMMUNICATOR) {
        const nextCommunicatorBoards = communicatorBoards.filter(
          (cb) => cb.id !== board.id
        );
        await updateCommunicatorBoards(nextCommunicatorBoards);
        refetch();
        return;
      }
      await addOrRemoveFromCommunicator(board);
    },
    [
      section,
      communicatorBoards,
      updateCommunicatorBoards,
      addOrRemoveFromCommunicator,
      refetch
    ]
  );

  const setRootBoard = useCallback(
    async (board) => {
      const updatedCommunicatorData = {
        ...currentCommunicator,
        rootBoard: board.id
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
    },
    [
      currentCommunicator,
      userData,
      verifyAndUpsertCommunicator,
      upsertApiCommunicator
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
