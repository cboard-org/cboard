import { useCallback } from 'react';
import history from '../../../../history';
import useCommunicatorBoards from './useCommunicatorBoards';
import useBoardCrud from './useBoardCrud';
import useBoardExport from './useBoardExport';

/**
 * All the board/communicator business logic, extracted from the old
 * CommunicatorDialog container. Receives the redux state/dispatchers as deps
 * (the container stays the redux boundary) plus the active section and the
 * fetcher mutators so the visible list stays in sync after each operation.
 *
 * Composes three hooks along the seams of what they touch: communicator
 * membership, board lifecycle and export.
 */
const useBoardActions = ({
  section,
  intl,
  userData,
  language,
  communicators,
  currentCommunicator,
  communicatorBoards,
  availableBoards,
  // dispatchers
  createBoard,
  updateBoard,
  replaceBoard,
  addBoards,
  deleteBoard,
  deleteApiBoard,
  updateApiBoard,
  updateApiObjectsNoChild,
  addBoardCommunicator,
  verifyAndUpsertCommunicator,
  upsertApiCommunicator,
  showNotification,
  // fetcher mutators
  refetch,
  removeBoardFromList,
  replaceBoardInList,
  switchBoard,
  onClose
}) => {
  const communicatorActions = useCommunicatorBoards({
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
  });

  const crudActions = useBoardCrud({
    intl,
    userData,
    language,
    communicators,
    currentCommunicator,
    availableBoards,
    createBoard,
    updateBoard,
    replaceBoard,
    deleteBoard,
    deleteApiBoard,
    updateApiBoard,
    updateApiObjectsNoChild,
    addBoardCommunicator,
    verifyAndUpsertCommunicator,
    upsertApiCommunicator,
    showNotification,
    removeBoardFromList,
    replaceBoardInList
  });

  const exportActions = useBoardExport({ intl, showNotification });

  const showBoard = useCallback(
    async (board) => {
      switchBoard(board.id);
      history.replace(`/board/${board.id}`);
      onClose();
    },
    [switchBoard, onClose]
  );

  return {
    ...communicatorActions,
    ...crudActions,
    ...exportActions,
    showBoard
  };
};

export default useBoardActions;
