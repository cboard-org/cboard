import API from '../../../api';
import { LOGIN_SUCCESS, LOGOUT } from './Login.constants';
import { addBoards } from '../../Board/Board.actions';

export function loginSuccess(payload) {
  return {
    type: LOGIN_SUCCESS,
    payload
  };
}

export function logout() {
  return {
    type: LOGOUT
  };
}

export function login({ email, password }, role = 'admin') {
  return async (dispatch, getState) => {
    try {
      const data = await API.login(role, email, password);
      dispatch(loginSuccess(data));
      const { communicator, board } = getState();

      const activeCommunicatorId = communicator.activeCommunicatorId;
      const currentCommunicator = communicator.communicators.find(
        communicator => communicator.id === activeCommunicatorId
      );

      const localBoardsIds = [];
      const localBoards = board.boards.filter(board => {
        const isLocalBoard = currentCommunicator.boards.indexOf(board.id) >= 0;
        if (isLocalBoard) {
          localBoardsIds.push(board.id);
        }
        return isLocalBoard;
      });

      const apiBoardsIds = currentCommunicator.boards.filter(
        id => localBoardsIds.indexOf(id) < 0
      );
      const apiBoards = await apiBoardsIds.reduce(async (prevBoards, id) => {
        let boards = prevBoards;
        try {
          const board = await API.getBoard(id);
          boards.push(board);
        } catch (e) {}
        return boards;
      }, []);

      dispatch(addBoards(apiBoards));
    } catch (e) {
      return Promise.reject(e.response.data);
    }
  };
}
