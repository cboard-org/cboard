import isUrl from 'is-url';

import moment from 'moment';

import {
  IMPORT_BOARDS,
  ADD_BOARDS,
  CHANGE_BOARD,
  SWITCH_BOARD,
  PREVIOUS_BOARD,
  TO_ROOT_BOARD,
  DELETE_BOARD,
  CREATE_BOARD,
  UPDATE_BOARD,
  CREATE_TILE,
  DELETE_TILES,
  EDIT_TILES,
  FOCUS_TILE,
  CLICK_SYMBOL,
  CLICK_OUTPUT,
  CHANGE_OUTPUT,
  CHANGE_IMPROVED_PHRASE,
  CHANGE_LIVE_MODE,
  REPLACE_BOARD,
  HISTORY_REMOVE_BOARD,
  UNMARK_BOARD,
  CREATE_API_BOARD_SUCCESS,
  CREATE_API_BOARD_FAILURE,
  CREATE_API_BOARD_STARTED,
  UPDATE_API_BOARD_SUCCESS,
  UPDATE_API_BOARD_FAILURE,
  UPDATE_API_BOARD_STARTED,
  DELETE_API_BOARD_SUCCESS,
  DELETE_API_BOARD_FAILURE,
  DELETE_API_BOARD_STARTED,
  GET_API_MY_BOARDS_SUCCESS,
  GET_API_MY_BOARDS_FAILURE,
  GET_API_MY_BOARDS_STARTED,
  DOWNLOAD_IMAGES_SUCCESS,
  DOWNLOAD_IMAGES_FAILURE,
  DOWNLOAD_IMAGES_STARTED,
  DOWNLOAD_IMAGE_SUCCESS,
  DOWNLOAD_IMAGE_FAILURE,
  UNMARK_SHOULD_CREATE_API_BOARD,
  SHORT_ID_MAX_LENGTH,
  SYNC_BOARDS_STARTED,
  SYNC_BOARDS_SUCCESS,
  SYNC_BOARDS_FAILURE,
  SYNC_STATUS
} from './Board.constants';

import API from '../../api';

import {
  replaceBoardCommunicator,
  upsertCommunicator,
  getApiMyCommunicators,
  editCommunicator,
  upsertApiCommunicator,
  updateDefaultBoardsIncluded,
  addDefaultBoardIncluded,
  verifyAndUpsertCommunicator
} from '../Communicator/Communicator.actions';
import { isAndroid, writeCvaFile } from '../../cordova-util';
import { DEFAULT_BOARDS } from '../../helpers';
import history from './../../history';
import { improvePhraseAbortController } from '../../api/api';

const BOARDS_PAGE_LIMIT = 500;

export function importBoards(boards) {
  return {
    type: IMPORT_BOARDS,
    boards
  };
}

export function addBoards(boards) {
  return {
    type: ADD_BOARDS,
    boards
  };
}

function getActiveCommunicator(getState) {
  const { communicator } = getState();

  const { communicators, activeCommunicatorId } = communicator;
  const activeCommunicator =
    communicators[
      communicators.findIndex(
        communicator => communicator.id === activeCommunicatorId
      )
    ];
  return activeCommunicator;
}

function replaceHistoryWithActiveBoardId(getState) {
  const { board } = getState();
  const id = board.activeBoardId;
  history.replace(`/board/${id}`);
}

export function changeDefaultBoard(selectedBoardNameOnJson) {
  return (dispatch, getState) => {
    const board = DEFAULT_BOARDS[selectedBoardNameOnJson];
    const BOARD_ALREADY_INCLUDED_NAME = 'advanced';

    const checkUserCommunicator = () => {
      const userData = getState().app?.userData;
      const activeCommunicator = getActiveCommunicator(getState);

      if (userData.email && activeCommunicator.email !== userData?.email) {
        // Create a new communicator for the user if it doesn't exist
        dispatch(verifyAndUpsertCommunicator(activeCommunicator));
      }
      return getActiveCommunicator(getState);
    };

    const activeCommunicator = checkUserCommunicator();

    const fallbackInitialDefaultBoardsIncluded = activeCommunicator => {
      const oldUserHomeBoard = activeCommunicator.rootBoard;

      const boardAlreadyIncludedData = {
        nameOnJSON: BOARD_ALREADY_INCLUDED_NAME,
        homeBoard: oldUserHomeBoard
      };

      const initialDefaultBoardsIncluded = [boardAlreadyIncludedData];

      dispatch(updateDefaultBoardsIncluded(initialDefaultBoardsIncluded));
      return initialDefaultBoardsIncluded;
    };

    const hasValidDefaultBoardsIncluded = !!activeCommunicator
      .defaultBoardsIncluded?.length;

    const defaultBoardsIncluded = hasValidDefaultBoardsIncluded
      ? activeCommunicator.defaultBoardsIncluded
      : fallbackInitialDefaultBoardsIncluded(activeCommunicator);

    const defaultBoardsNamesIncluded = defaultBoardsIncluded?.map(
      includedBoardObject => includedBoardObject.nameOnJSON
    ) || [BOARD_ALREADY_INCLUDED_NAME];

    const updatedHomeBoard = defaultBoardsIncluded?.filter(
      ({ nameOnJSON }) => nameOnJSON === selectedBoardNameOnJson
    )[0]?.homeBoard;

    const homeBoardId = updatedHomeBoard || board[0]?.id;

    const includeNewBoards = ({
      defaultBoardsNamesIncluded,
      selectedBoardNameOnJson,
      board,
      homeBoardId
    }) => {
      if (!defaultBoardsNamesIncluded.includes(selectedBoardNameOnJson)) {
        dispatch(
          addDefaultBoardIncluded({
            nameOnJSON: selectedBoardNameOnJson,
            homeBoard: homeBoardId
          })
        );
      }
    };

    const switchActiveBoard = homeBoardId => {
      if (homeBoardId) {
        const goTo = `/board/${homeBoardId}`;

        dispatch(switchBoard(homeBoardId));
        history.replace(goTo);
      }
    };

    const replaceHomeBoard = async homeBoardId => {
      const {
        communicator: {
          communicators: updatedCommunicators,
          activeCommunicatorId
        },
        app
      } = getState();

      const userData = app?.userData;

      const activeCommunicator = updatedCommunicators.filter(
        communicator => communicator.id === activeCommunicatorId
      )[0];

      const communicatorWithRootBoardReplaced = {
        ...activeCommunicator,
        boards: activeCommunicator.boards.includes(homeBoardId)
          ? activeCommunicator.boards
          : [...activeCommunicator.boards, homeBoardId],
        rootBoard: homeBoardId
      };

      dispatch(editCommunicator(communicatorWithRootBoardReplaced));
      if (userData?.role) {
        dispatch(
          upsertApiCommunicator(communicatorWithRootBoardReplaced)
        ).catch(console.error);
      }
    };

    if (!board) return;

    includeNewBoards({
      defaultBoardsNamesIncluded,
      selectedBoardNameOnJson,
      board,
      homeBoardId
    });

    switchActiveBoard(homeBoardId);

    replaceHomeBoard(homeBoardId);
  };
}

export function replaceDefaultHomeBoardIfIsNescesary(prev, current) {
  return (dispatch, getState) => {
    const activeCommunicator = getActiveCommunicator(getState);
    const defaultBoardsIncluded = activeCommunicator.defaultBoardsIncluded;

    const updatedValue = defaultBoardsIncluded?.map(defaultBoard => {
      if (defaultBoard.homeBoard === prev) defaultBoard.homeBoard = current;
      return defaultBoard;
    });

    if (!!defaultBoardsIncluded)
      dispatch(updateDefaultBoardsIncluded(updatedValue));
  };
}

export function replaceBoard(prev, current) {
  return {
    type: REPLACE_BOARD,
    payload: { prev, current }
  };
}

export function createBoard(boardData) {
  return {
    type: CREATE_BOARD,
    boardData
  };
}

export function updateBoard(boardData, fromRemote = false) {
  return {
    type: UPDATE_BOARD,
    boardData,
    fromRemote
  };
}
export function deleteBoard(boardId) {
  return {
    type: DELETE_BOARD,
    boardId
  };
}

export function switchBoard(boardId) {
  return {
    type: SWITCH_BOARD,
    boardId
  };
}

export function changeBoard(boardId) {
  return {
    type: CHANGE_BOARD,
    boardId
  };
}

export function previousBoard() {
  return (dispatch, getState) => {
    dispatch({
      type: PREVIOUS_BOARD
    });
    replaceHistoryWithActiveBoardId(getState);
  };
}

export function toRootBoard() {
  return (dispatch, getState) => {
    dispatch({
      type: TO_ROOT_BOARD
    });
    replaceHistoryWithActiveBoardId(getState);
  };
}

export function historyRemoveBoard(removedBoardId) {
  return {
    type: HISTORY_REMOVE_BOARD,
    removedBoardId
  };
}

export function unmarkBoard(boardId) {
  return {
    type: UNMARK_BOARD,
    boardId
  };
}

export function createTile(tile, boardId) {
  return {
    type: CREATE_TILE,
    tile,
    boardId
  };
}

export function deleteTiles(tiles, boardId) {
  return {
    type: DELETE_TILES,
    tiles,
    boardId
  };
}

export function editTiles(tiles, boardId) {
  return {
    type: EDIT_TILES,
    tiles,
    boardId
  };
}

export function focusTile(tileId, boardId) {
  return {
    type: FOCUS_TILE,
    tileId,
    boardId
  };
}

export function clickSymbol(symbolLabel) {
  return {
    type: CLICK_SYMBOL,
    symbolLabel
  };
}

export function clickOutput(outputPhrase) {
  return {
    type: CLICK_OUTPUT,
    outputPhrase
  };
}

export function changeOutput(output) {
  return async (dispatch, getState) => {
    const {
      app: {
        navigationSettings: { improvePhraseActive }
      }
    } = getState();
    if (improvePhraseActive) dispatch(improvePhrase(output));
    dispatch({
      type: CHANGE_OUTPUT,
      output
    });
  };
}

export function improvePhrase(output) {
  const fetchImprovePhrase = async language => {
    const MIN_TILES_TO_IMPROVE = 1;
    if (output.length <= MIN_TILES_TO_IMPROVE) return '';
    const labels = output.map(symbol => symbol.label);
    const phrase = labels.join(' '); //this.handlePhraseToShare();
    const improvedPhrase = await API.improvePhrase({ phrase, language });
    return improvedPhrase.phrase;
  };
  return async (dispatch, getState) => {
    try {
      const language = getState().language.lang;
      if (improvePhraseAbortController?.abort)
        improvePhraseAbortController.abort();
      const improvedPhrase = await fetchImprovePhrase(language);
      dispatch({
        type: CHANGE_IMPROVED_PHRASE,
        improvedPhrase
      });
    } catch (err) {
      console.error('error', err);
    }
  };
}

export function changeLiveMode() {
  return {
    type: CHANGE_LIVE_MODE
  };
}

export function getApiMyBoardsSuccess(boards) {
  return {
    type: GET_API_MY_BOARDS_SUCCESS,
    boards
  };
}

export function getApiMyBoardsStarted() {
  return {
    type: GET_API_MY_BOARDS_STARTED
  };
}

export function getApiMyBoardsFailure(message) {
  return {
    type: GET_API_MY_BOARDS_FAILURE,
    message
  };
}

export function createApiBoardSuccess(board, boardId) {
  return {
    type: CREATE_API_BOARD_SUCCESS,
    board,
    boardId
  };
}

export function createApiBoardStarted() {
  return {
    type: CREATE_API_BOARD_STARTED
  };
}

export function createApiBoardFailure(message) {
  return {
    type: CREATE_API_BOARD_FAILURE,
    message
  };
}

export function updateApiBoardSuccess(board) {
  return dispatch => {
    const { isLocalUpdateNeeded, ...boardData } = board ?? {};

    if (!board || Object.keys(boardData).length === 0) {
      dispatch(updateApiBoardFailure('No board data to update'));
      return;
    }

    if (isLocalUpdateNeeded) {
      dispatch({
        type: UPDATE_BOARD,
        boardData: boardData
      });
    }

    dispatch({
      type: UPDATE_API_BOARD_SUCCESS,
      boardData
    });
  };
}

export function updateApiBoardStarted() {
  return {
    type: UPDATE_API_BOARD_STARTED
  };
}

export function updateApiBoardFailure(message) {
  return {
    type: UPDATE_API_BOARD_FAILURE,
    message
  };
}
export function deleteApiBoardSuccess(board) {
  return {
    type: DELETE_API_BOARD_SUCCESS,
    board
  };
}

export function deleteApiBoardStarted() {
  return {
    type: DELETE_API_BOARD_STARTED
  };
}

export function deleteApiBoardFailure(message) {
  return {
    type: DELETE_API_BOARD_FAILURE,
    message
  };
}

export function downloadImagesSuccess() {
  return {
    type: DOWNLOAD_IMAGES_SUCCESS
  };
}

export function downloadImagesStarted() {
  return {
    type: DOWNLOAD_IMAGES_STARTED
  };
}

export function downloadImagesFailure(message) {
  return {
    type: DOWNLOAD_IMAGES_FAILURE,
    message
  };
}
export function downloadImageSuccess(element) {
  return {
    type: DOWNLOAD_IMAGE_SUCCESS,
    element
  };
}

export function downloadImageFailure(message) {
  return {
    type: DOWNLOAD_IMAGE_FAILURE,
    message
  };
}

export function getApiMyBoards() {
  return async dispatch => {
    dispatch(getApiMyBoardsStarted());
    try {
      const res = await API.getMyBoards({ limit: BOARDS_PAGE_LIMIT });
      dispatch(getApiMyBoardsSuccess(res));
      if (res?.data && Array.isArray(res.data)) {
        try {
          await dispatch(syncBoards(res.data));
        } catch (e) {
          console.error(e);
        }
      }
      return res;
    } catch (err) {
      dispatch(getApiMyBoardsFailure(err.message));
      throw new Error(err.message);
    }
  };
}

/**
 * Classify remote boards for PULL operation.
 * Identifies boards that are new from the server or have newer versions on the server.
 * @param {Array} localBoards - Boards from local state
 * @param {Array} remoteBoards - Boards from the server
 * @returns {{ boardsToAdd, boardsToUpdate, boardIdsToDelete }}
 */
export function classifyRemoteBoards(localBoards, remoteBoards) {
  const boardsToAdd = [];
  const boardsToUpdate = [];
  const boardIdsToDelete = [];

  const remoteBoardIds = new Set(remoteBoards.map(b => b.id));

  for (const remote of remoteBoards) {
    const local = localBoards.find(b => b.id === remote.id);

    if (!local) {
      boardsToAdd.push(remote);
      continue;
    }

    if (moment(remote.lastEdited).isAfter(local.lastEdited)) {
      boardsToUpdate.push(remote);
    }
  }

  // Identify boards deleted on server
  for (const local of localBoards) {
    const hasServerId = local.id.length >= SHORT_ID_MAX_LENGTH;
    const notInRemote = !remoteBoardIds.has(local.id);
    const notLocallyDeleted = !local.isDeleted;

    if (hasServerId && notInRemote && notLocallyDeleted) {
      boardIdsToDelete.push(local.id);
    }
  }

  return {
    boardsToAdd,
    boardsToUpdate,
    boardIdsToDelete
  };
}

// Action creators for sync status
export function syncBoardsStarted() {
  return { type: SYNC_BOARDS_STARTED };
}

export function syncBoardsSuccess() {
  return { type: SYNC_BOARDS_SUCCESS };
}

export function syncBoardsFailure(error) {
  return { type: SYNC_BOARDS_FAILURE, error: error.message || error };
}

/**
 * PULL: Apply remote changes to local Redux state.
 * Adds new remote boards and updates boards where remote is newer.
 */
export function applyRemoteChangesToState({
  boardsToAdd,
  boardsToUpdate,
  boardIdsToDelete = []
}) {
  return async dispatch => {
    if (boardsToAdd.length > 0) {
      dispatch(addBoards(boardsToAdd));
    }
    for (const board of boardsToUpdate) {
      const fromRemote = true; //sets syncStatus to SYNCED
      dispatch(updateBoard(board, fromRemote));
    }
    // Verify boards that appear deleted on server
    for (const boardId of boardIdsToDelete) {
      try {
        const res = await API.getBoard(boardId);
        if (res) {
          dispatch(updateBoard(res, true));
        }
      } catch (e) {
        if (e.response?.status === 404) {
          dispatch(deleteApiBoardSuccess({ id: boardId }));
          continue;
        }
      }
    }
  };
}

/**
 * PUSH: Upload local changes to the API.
 * Pushes all boards with syncStatus: PENDING.
 * - Short ID boards (locally created) → updateApiObjectsNoChild (creates on server)
 * - Long ID boards (existing) → updateApiBoard (updates on server)
 */
export function pushLocalChangesToApi() {
  return async (dispatch, getState) => {
    const { boards, activeBoardId } = getState().board;

    // Separate boards to sync vs boards to delete
    const boardsToSync = boards.filter(
      b => b.syncStatus === SYNC_STATUS.PENDING && !b.isDeleted
    );
    const boardsToDelete = boards.filter(b => b.isDeleted === true);

    // PUSH: Create/update boards
    for (const board of boardsToSync) {
      try {
        if (board.id.length < SHORT_ID_MAX_LENGTH) {
          const newBoardId = await dispatch(
            updateApiObjectsNoChild(board, true)
          );
          dispatch(replaceBoard(board, { ...board, id: newBoardId }));
          if (activeBoardId === board.id) {
            replaceHistoryWithActiveBoardId(getState);
          }
        } else {
          await dispatch(updateApiBoard(board));
        }
      } catch (e) {
        console.error('Failed to push board to API:', board.id, e);
      }
    }

    // PUSH: Delete boards from server
    for (const board of boardsToDelete) {
      if (board.id.length >= SHORT_ID_MAX_LENGTH) {
        // Board with server ID: delete from server

        try {
          await dispatch(deleteApiBoard(board.id));
          // DELETE_API_BOARD_SUCCESS handles hard delete
        } catch (e) {
          if (e.response?.status === 404) {
            dispatch(deleteApiBoardSuccess({ id: board.id }));
            continue;
          }

          console.error('Failed to delete board from API:', board.id, e);
        }
      } else {
        // Local board without server ID: just hard delete locally
        dispatch(deleteApiBoardSuccess({ id: board.id }));
      }
    }
  };
}

/**
 * Synchronize local boards with remote boards.
 * Order: PULL first (apply remote changes), then PUSH (upload local changes)
 */
export function syncBoards(remoteBoards) {
  return async (dispatch, getState) => {
    dispatch(syncBoardsStarted());

    try {
      const localBoards = getState().board.boards;

      // 1. Classify boards for PULL (remote changes + remote deletions)
      const {
        boardsToAdd,
        boardsToUpdate,
        boardIdsToDelete
      } = classifyRemoteBoards(localBoards, remoteBoards);

      // 2. PULL: Apply remote changes to local state (includes remote deletions)
      await dispatch(
        applyRemoteChangesToState({
          boardsToAdd,
          boardsToUpdate,
          boardIdsToDelete
        })
      );

      // 3. PUSH: Upload local changes + delete locally deleted boards from server
      await dispatch(pushLocalChangesToApi());

      dispatch(syncBoardsSuccess());
      return { success: true };
    } catch (error) {
      console.error('Sync boards failed:', error);
      dispatch(syncBoardsFailure(error));
      return { success: false, error };
    }
  };
}

export function createApiBoard(boardData, boardId) {
  return async dispatch => {
    dispatch(createApiBoardStarted());
    boardData = {
      ...boardData,
      isPublic: false
    };
    return API.createBoard(boardData)
      .then(res => {
        dispatch(createApiBoardSuccess(res, boardId));
        return res;
      })
      .catch(err => {
        dispatch(createApiBoardFailure(err.message));
        throw new Error(err.message);
      });
  };
}

export function updateApiBoard(boardData) {
  return async dispatch => {
    dispatch(updateApiBoardStarted());
    return API.updateBoard(boardData)
      .then(res => {
        dispatch(updateApiBoardSuccess(res));
        return res;
      })
      .catch(err => {
        dispatch(updateApiBoardFailure(err.message));
        throw new Error(err.message);
      });
  };
}

export function upsertApiBoard(boardData) {
  return dispatch => {
    if (boardData.id.length < 14) {
      return dispatch(createApiBoard(boardData, boardData.id))
        .then(res => {
          return res;
        })
        .catch(e => {
          throw new Error(e.message);
        });
    } else {
      return dispatch(updateApiBoard(boardData));
    }
  };
}

export function deleteApiBoard(boardId) {
  return dispatch => {
    dispatch(deleteApiBoardStarted());

    return API.deleteBoard(boardId)
      .then(res => {
        dispatch(deleteApiBoardSuccess(res));
        return res;
      })
      .catch(err => {
        dispatch(deleteApiBoardFailure(err.message));
        throw err;
      });
  };
}

/*
 * Thunk asynchronous functions
 */
export function getApiObjects() {
  return dispatch => {
    return dispatch(getApiMyBoards())
      .then(res => {
        return dispatch(getApiMyCommunicators())
          .then(res => {})
          .catch(err => {
            console.error(err.message);
          });
      })
      .catch(err => {
        console.error(err.message);
      });
  };
}

export function downloadImages() {
  return async (dispatch, getState) => {
    try {
      dispatch(downloadImagesStarted());
      const boards = getState().board.boards;
      const images = getState().board.images;
      for (let i = 0; i < boards.length; i++) {
        if (
          typeof boards[i] !== 'undefined' &&
          typeof boards[i].caption !== 'undefined' &&
          isUrl(boards[i].caption)
        ) {
          const img = images.find(image => image.id === boards[i].id);
          if (!img) {
            const element = await storeImage(
              boards[i].caption,
              boards[i].id,
              'board'
            );
            if (element) dispatch(downloadImageSuccess(element));
          }
        }
        for (let j = 0; j < boards[i].tiles.length; j++) {
          if (
            typeof boards[i].tiles[j] !== 'undefined' &&
            typeof boards[i].tiles[j].image !== 'undefined' &&
            isUrl(boards[i].tiles[j].image)
          ) {
            const img = images.find(
              image => image.id === boards[i].tiles[j].id
            );
            if (!img) {
              const element = await storeImage(
                boards[i].tiles[j].image,
                boards[i].tiles[j].id,
                'tile'
              );
              if (element) dispatch(downloadImageSuccess(element));
            }
          }
        }
      }
      dispatch(downloadImagesSuccess());
    } catch (err) {
      dispatch(downloadImagesFailure(err.message));
    }
  };
}

async function storeImage(image, id, type) {
  let element = null;
  try {
    let response = await fetch(image);
    const blob = await response.blob();
    const fileName = getFileNameFromUrl(image);
    if (isAndroid()) {
      const filePath = '/Android/data/com.unicef.cboard/files/' + fileName;
      const fEntry = await writeCvaFile(filePath, blob);
      element = {
        id: id,
        type: type,
        url: image,
        location: fEntry.nativeURL
      };
    }
  } catch (err) {
    console.log(err.message);
  }
  return element;
}

function getFileNameFromUrl(url) {
  const parsed = new URL(url);
  const filename = parsed.pathname.substring(
    parsed.pathname.lastIndexOf('/') + 1
  );
  if (filename.lastIndexOf('.') !== -1) {
    return filename;
  } else {
    return `${filename}.png`;
  }
}

export function updateApiObjectsNoChild(
  parentBoard,
  createParentBoard = false
) {
  return async (dispatch, getState) => {
    //create - update parent board
    const action = createParentBoard ? createApiBoard : updateApiBoard;
    return await dispatch(action(parentBoard, parentBoard.id))
      .then(res => {
        const updatedParentBoardId = res.id;
        //add new boards to the active communicator
        if (parentBoard.id !== updatedParentBoardId) {
          dispatch(
            replaceBoardCommunicator(parentBoard.id, updatedParentBoardId)
          );
        }

        dispatch(
          replaceDefaultHomeBoardIfIsNescesary(
            parentBoard.id,
            updatedParentBoardId
          )
        );

        //check if parent board is the root board of the communicator
        const comm = getState().communicator.communicators.find(
          communicator =>
            communicator.id === getState().communicator.activeCommunicatorId
        );
        if (comm.rootBoard === parentBoard.id) {
          comm.rootBoard = updatedParentBoardId;
          comm.activeBoardId = updatedParentBoardId;
          dispatch(upsertCommunicator(comm));
        }
        return dispatch(upsertApiCommunicator(comm))
          .then(async () => {
            await dispatch(updateApiMarkedBoards());
            return updatedParentBoardId;
          })
          .catch(e => {
            throw new Error(e.message);
          });
      })
      .catch(e => {
        throw new Error(e.message);
      });
  };
}
export function updateApiMarkedBoards() {
  return async (dispatch, getState) => {
    const allBoards = [...getState().board.boards];
    for await (const board of allBoards) {
      const boardsIds = getState().board.boards?.map(board => board.id);
      if (!boardsIds.includes(board.id)) return;

      if (
        board.id.length > 14 &&
        board.hasOwnProperty('email') &&
        board.email === getState().app.userData.email &&
        board.hasOwnProperty('markToUpdate') &&
        board.markToUpdate
      ) {
        try {
          await dispatch(updateApiBoard(board));
          dispatch(unmarkBoard(board.id));
        } catch (e) {
          throw new Error(e.message);
        }
      }
      if (board.id.length < SHORT_ID_MAX_LENGTH && board.shouldCreateBoard) {
        const state = getState();

        // TODO - translate name using intl in a redux action
        //name: intl.formatMessage({ id: allBoards[i].nameKey })
        const extractName = () => {
          const splitedNameKey = board.nameKey.split('.');
          const NAMEKEY_LAST_INDEX = splitedNameKey.length - 1;
          return splitedNameKey[NAMEKEY_LAST_INDEX];
        };
        const name = board.name ?? extractName();
        let boardData = {
          ...board,
          author: state.app.userData.name,
          email: state.app.userData.email,
          hidden: false,
          locale: state.lang,
          name
        };
        delete boardData.shouldCreateBoard;
        dispatch(unmarkShouldCreateBoard(boardData.id));

        dispatch(updateBoard(boardData));
        try {
          const boardId = await dispatch(
            updateApiObjectsNoChild(boardData, true)
          );
          dispatch(
            replaceBoard({ ...boardData }, { ...boardData, id: boardId })
          );
        } catch (err) {
          console.log(err.message);
        }
      }
    }
  };
}

function unmarkShouldCreateBoard(boardId) {
  return {
    type: UNMARK_SHOULD_CREATE_API_BOARD,
    boardId
  };
}

export function updateApiObjects(
  childBoard,
  parentBoard,
  createParentBoard = false
) {
  return (dispatch, getState) => {
    //create child board
    return dispatch(createApiBoard(childBoard, childBoard.id))
      .then(res => {
        const updatedChildBoardId = res.id;
        //create - update parent board
        const updateTilesParentBoard = () =>
          parentBoard.tiles.map(tile => {
            if (tile.loadBoard === childBoard.id)
              return { ...tile, loadBoard: updatedChildBoardId };
            return tile;
          });
        const updatedParentBoard = {
          ...parentBoard,
          tiles: createParentBoard
            ? updateTilesParentBoard()
            : parentBoard.tiles
        };
        const action = createParentBoard ? createApiBoard : updateApiBoard;
        return dispatch(action(updatedParentBoard, parentBoard.id))
          .then(res => {
            const updatedParentBoardId = res.id;
            //add new boards to the active communicator
            dispatch(
              replaceBoardCommunicator(childBoard.id, updatedChildBoardId)
            );
            if (parentBoard.id !== updatedParentBoardId) {
              dispatch(
                replaceBoardCommunicator(parentBoard.id, updatedParentBoardId)
              );
            }

            dispatch(
              replaceDefaultHomeBoardIfIsNescesary(
                parentBoard.id,
                updatedParentBoardId
              )
            );

            //check if parent board is the root board of the communicator
            const comm = getState().communicator.communicators.find(
              communicator =>
                communicator.id === getState().communicator.activeCommunicatorId
            );
            if (comm.rootBoard === parentBoard.id) {
              comm.rootBoard = updatedParentBoardId;
              comm.activeBoardId = updatedParentBoardId;
              dispatch(upsertCommunicator(comm));
            }
            return dispatch(upsertApiCommunicator(comm))
              .then(() => {
                dispatch(updateApiMarkedBoards());
                return updatedParentBoardId;
              })
              .catch(e => {
                throw new Error(e.message);
              });
          })
          .catch(e => {
            throw new Error(e.message);
          });
      })
      .catch(e => {
        throw new Error(e.message);
      });
  };
}
