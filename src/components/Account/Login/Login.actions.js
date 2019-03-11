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

export function login({ email, password }, type = 'local') {
  return async (dispatch, getState) => {
    try {
      const apiMethod = type === 'local' ? 'login' : 'oAuthLogin';
      const loginData = await API[apiMethod](email, password);
      const { communicator, board } = getState();

      const activeCommunicatorId = communicator.activeCommunicatorId;
      let currentCommunicator = communicator.communicators.find(
        communicator => communicator.id === activeCommunicatorId
      );

      if (loginData.communicators && loginData.communicators.length) {
        currentCommunicator = loginData.communicators[0];
      }

      const localBoardsIds = [];
      board.boards.forEach(board => {
        if (currentCommunicator.boards.indexOf(board.id) >= 0) {
          localBoardsIds.push(board.id);
        }
      });

      const apiBoardsIds = currentCommunicator.boards.filter(
        id => localBoardsIds.indexOf(id) < 0
      );

      const apiBoards = await Promise.all(
        apiBoardsIds
          .map(async id => {
            let board = null;
            try {
              board = await API.getBoard(id);
            } catch (e) {}
            return board;
          })
          .filter(b => b !== null)
      );

      dispatch(addBoards(apiBoards));
      dispatch(loginSuccess(loginData));
    } catch (e) {
      if (e.response != null) {
        return Promise.reject(e.response.data);
      }
      var disonnected = {
        message: 'Unable to contact server. Try in a moment'
      };
      return Promise.reject(disonnected);
    }
  };
}
