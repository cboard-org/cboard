import {
  IMPORT_BOARDS,
  ADD_BOARDS,
  CHANGE_BOARD,
  SWITCH_BOARD,
  PREVIOUS_BOARD,
  DELETE_BOARD,
  CREATE_BOARD,
  UPDATE_BOARD,
  CREATE_TILE,
  DELETE_TILES,
  EDIT_TILES,
  FOCUS_TILE,
  CLICK_SYMBOL,
  CHANGE_OUTPUT,
  REPLACE_BOARD,
  HISTORY_REMOVE_PREVIOUS_BOARD,
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
  GET_API_MY_BOARDS_STARTED
} from './Board.constants';

import API from '../../api';

import {
  updateApiCommunicator,
  createApiCommunicator,
  replaceBoardCommunicator,
  upsertCommunicator,
  getApiMyCommunicators
} from '../Communicator/Communicator.actions';

const BOARDS_PAGE_LIMIT = 100;

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

export function updateBoard(boardData) {
  return {
    type: UPDATE_BOARD,
    boardData
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
  return {
    type: PREVIOUS_BOARD
  };
}

export function historyRemovePreviousBoard(boardId) {
  return {
    type: HISTORY_REMOVE_PREVIOUS_BOARD,
    boardId
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

export function changeOutput(output) {
  return {
    type: CHANGE_OUTPUT,
    output
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
  return {
    type: UPDATE_API_BOARD_SUCCESS,
    board
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

export function getApiMyBoards() {
  return dispatch => {
    dispatch(getApiMyBoardsStarted());
    return API.getMyBoards({
      limit: BOARDS_PAGE_LIMIT
    })
      .then(res => {
        dispatch(getApiMyBoardsSuccess(res));
        return res;
      })
      .catch(err => {
        dispatch(getApiMyBoardsFailure(err.message));
        throw new Error(err.message);
      });
  };
}

export function createApiBoard(boardData, boardId) {
  return dispatch => {
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
  return dispatch => {
    dispatch(updateApiBoardStarted());
    boardData = {
      ...boardData,
      isPublic: false
    };
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
        throw new Error(err.message);
      });
  };
}

/*
 * Thunk asynchronous functions
 */
export function getApiObjects() {
  return dispatch => {
    //get boards
    return dispatch(getApiMyBoards())
      .then(res => {
        return dispatch(getApiMyCommunicators())
          .then(res => {})
          .catch(e => {
            console.log(e.message);
          });
      })
      .catch(e => {
        console.log(e.message);
      });
  };
}

export function updateApiObjectsNoChild(
  parentBoard,
  createCommunicator = false,
  createParentBoard = false
) {
  return (dispatch, getState) => {
    //create - update parent board
    const action = createParentBoard ? createApiBoard : updateApiBoard;
    return dispatch(action(parentBoard, parentBoard.id))
      .then(res => {
        const updatedParentBoardId = res.id;
        //add new boards to the active communicator
        if (parentBoard.id !== updatedParentBoardId) {
          dispatch(
            replaceBoardCommunicator(parentBoard.id, updatedParentBoardId)
          );
        }
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
        const caction = createCommunicator
          ? createApiCommunicator
          : updateApiCommunicator;
        return dispatch(caction(comm, comm.id))
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
  };
}
export function updateApiMarkedBoards() {
  return (dispatch, getState) => {
    const allBoards = [...getState().board.boards];
    for (let i = 0; i < allBoards.length; i++) {
      if (
        allBoards[i].id.length > 14 &&
        allBoards[i].hasOwnProperty('email') &&
        allBoards[i].email === getState().app.userData.email &&
        allBoards[i].hasOwnProperty('markToUpdate') &&
        allBoards[i].markToUpdate
      ) {
        dispatch(updateApiBoard(allBoards[i]))
          .then(() => {
            dispatch(unmarkBoard(allBoards[i].id));
            return;
          })
          .catch(e => {
            throw new Error(e.message);
          });
      }
    }
    return;
  };
}

export function updateApiObjects(
  childBoard,
  parentBoard,
  createCommunicator = false,
  createParentBoard = false
) {
  return (dispatch, getState) => {
    //create child board
    return dispatch(createApiBoard(childBoard, childBoard.id))
      .then(res => {
        const updatedChildBoardId = res.id;
        //create - update parent board
        const action = createParentBoard ? createApiBoard : updateApiBoard;
        return dispatch(action(parentBoard, parentBoard.id))
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
            const caction = createCommunicator
              ? createApiCommunicator
              : updateApiCommunicator;
            return dispatch(caction(comm, comm.id))
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
