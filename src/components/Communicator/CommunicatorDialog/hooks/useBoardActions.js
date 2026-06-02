import { useCallback } from 'react';
import shortid from 'shortid';
import API from '../../../../api';
import { SECTIONS } from '../CommunicatorDialog.constants';
import messages from '../CommunicatorDialog.messages';

const isLoggedIn = userData =>
  !!userData && 'name' in userData && 'email' in userData;

/**
 * All the board/communicator business logic, extracted from the old
 * CommunicatorDialog container. Receives the redux state/dispatchers as deps
 * (the container stays the redux boundary) plus the active section and the
 * fetcher mutators so the visible list stays in sync after each operation.
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
  replaceBoardInList
}) => {
  const updateCommunicatorBoards = useCallback(
    async boards => {
      const updatedCommunicatorData = {
        ...currentCommunicator,
        boards: boards.map(cb => cb.id)
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

  const updateBoardReferences = useCallback(
    (board, newBoard, records) => {
      let prevBoardsRecords = records.map(entry => entry.prev);
      prevBoardsRecords = prevBoardsRecords.filter(id => id !== newBoard.id);
      availableBoards.forEach(b => {
        b.tiles.forEach((tile, index) => {
          if (tile && tile.loadBoard && tile.loadBoard === board.id) {
            b.tiles.splice(index, 1, { ...tile, loadBoard: newBoard.id });
            try {
              updateBoard(b);
            } catch (err) {
              console.log(err.message);
            }
          }
          if (
            tile &&
            tile.loadBoard &&
            prevBoardsRecords.includes(tile.loadBoard)
          ) {
            const el = records.find(e => e.prev === tile.loadBoard);
            b.tiles.splice(index, 1, { ...tile, loadBoard: el.next });
            try {
              updateBoard(b);
            } catch (err) {
              console.log(err.message);
            }
          }
        });
      });
    },
    [availableBoards, updateBoard]
  );

  const createBoardsRecursively = useCallback(
    async (board, records) => {
      if (!board) {
        return;
      }
      if (records) {
        const nextBoardsRecords = records.map(entry => entry.next);
        if (nextBoardsRecords.includes(board.id)) {
          return;
        }
      }

      let newBoard = {
        ...board,
        isPublic: false,
        id: shortid.generate(),
        hidden: false,
        author: '',
        email: ''
      };
      if (!newBoard.name) {
        newBoard.name = newBoard.nameKey
          ? intl.formatMessage({ id: newBoard.nameKey })
          : intl.formatMessage(messages.noTitle);
      }
      if (isLoggedIn(userData)) {
        newBoard = {
          ...newBoard,
          author: userData.name,
          email: userData.email
        };
      }
      createBoard(newBoard);
      if (!records) {
        verifyAndUpsertCommunicator({ ...currentCommunicator });
        addBoardCommunicator(newBoard.id);
      }

      if (!records) {
        records = [{ prev: board.id, next: newBoard.id }];
      } else {
        records.push({ prev: board.id, next: newBoard.id });
      }
      updateBoardReferences(board, newBoard, records);

      if (isLoggedIn(userData)) {
        try {
          const boardId = await updateApiObjectsNoChild(newBoard, true);
          newBoard = { ...newBoard, id: boardId };
        } catch (err) {
          console.log(err.message);
        }
      }

      if (board.tiles.length < 1) {
        return;
      }

      for (const tile of board.tiles) {
        if (tile.loadBoard && !tile.linkedBoard) {
          try {
            const nextBoard = await API.getBoard(tile.loadBoard);
            await createBoardsRecursively(nextBoard, records);
          } catch (err) {
            if (!err.respose || err.response?.status === 404) {
              const localBoard = availableBoards.find(
                b => b.id === tile.loadBoard
              );
              if (localBoard) {
                await createBoardsRecursively(localBoard, records);
              }
            }
          }
        }
      }
    },
    [
      intl,
      userData,
      currentCommunicator,
      availableBoards,
      createBoard,
      verifyAndUpsertCommunicator,
      addBoardCommunicator,
      updateApiObjectsNoChild,
      updateBoardReferences
    ]
  );

  const copyBoard = useCallback(
    async board => {
      try {
        await createBoardsRecursively(board);
        showNotification(intl.formatMessage(messages.boardAddedToCommunicator));
      } catch (err) {
        console.log(err.message);
        showNotification(intl.formatMessage(messages.boardCopyError));
      }
    },
    [createBoardsRecursively, showNotification, intl]
  );

  const addOrRemoveFromCommunicator = useCallback(
    async board => {
      const nextCommunicatorBoards = [...communicatorBoards];
      const boardIndex = nextCommunicatorBoards.findIndex(
        b => b.id === board.id
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
        availableBoards.findIndex(b => b.id === board.id) < 0
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
    async board => {
      if (section === SECTIONS.MY_COMMUNICATOR) {
        const nextCommunicatorBoards = communicatorBoards.filter(
          cb => cb.id !== board.id
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
    async board => {
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

  const publishBoard = useCallback(
    async board => {
      const boardData = { ...board, isPublic: !board.isPublic };
      replaceBoard(board, boardData);
      replaceBoardInList(boardData);
      showNotification(
        intl.formatMessage(
          boardData.isPublic
            ? messages.boardPublished
            : messages.boardUnpublished
        )
      );

      if (isLoggedIn(userData)) {
        try {
          const boardResponse = await API.updateBoard(boardData);
          replaceBoard(boardData, boardResponse);
          replaceBoardInList(boardResponse);
        } catch (err) {}
      }
    },
    [userData, replaceBoard, replaceBoardInList, showNotification, intl]
  );

  const deleteMyBoard = useCallback(
    async board => {
      deleteBoard(board.id);

      if (isLoggedIn(userData)) {
        try {
          await deleteApiBoard(board.id);
        } catch (err) {}
      }

      for await (const comm of communicators) {
        if (comm.boards.includes(board.id)) {
          const filteredCommunicator = {
            ...comm,
            boards: comm.boards.filter(b => b !== board.id)
          };
          const upsertedCommunicator = verifyAndUpsertCommunicator(
            filteredCommunicator
          );
          if (isLoggedIn(userData)) {
            try {
              await upsertApiCommunicator(upsertedCommunicator);
            } catch (err) {
              console.error('Error upserting communicator', err);
            }
          }
        }
      }

      removeBoardFromList(board.id);
      showNotification(intl.formatMessage(messages.boardDeleted));
    },
    [
      userData,
      communicators,
      deleteBoard,
      deleteApiBoard,
      verifyAndUpsertCommunicator,
      upsertApiCommunicator,
      removeBoardFromList,
      showNotification,
      intl
    ]
  );

  const updateMyBoard = useCallback(
    async board => {
      updateBoard(board);
      replaceBoardInList(board);
      if (isLoggedIn(userData)) {
        try {
          await updateApiBoard(board);
        } catch (err) {}
      }
    },
    [userData, updateBoard, updateApiBoard, replaceBoardInList]
  );

  const boardReport = useCallback(
    async reportedBoardData => {
      reportedBoardData.whistleblower.language = language.lang;
      await API.boardReport(reportedBoardData);
    },
    [language]
  );

  return {
    addOrRemoveBoard,
    copyBoard,
    setRootBoard,
    publishBoard,
    deleteMyBoard,
    updateMyBoard,
    boardReport
  };
};

export default useBoardActions;
