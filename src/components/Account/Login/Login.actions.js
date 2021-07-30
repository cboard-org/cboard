import API from '../../../api';
import { LOGIN_SUCCESS, LOGOUT } from './Login.constants';
import { addBoards } from '../../Board/Board.actions';
import {
  changeVoice,
  changePitch,
  changeRate
} from '../../../providers/SpeechProvider/SpeechProvider.actions';
import { disableTour } from '../../App/App.actions';

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
      if (type === 'local') {
        dispatch(
          disableTour({
            isRootBoardTourEnabled: false,
            isUnlockedTourEnabled: false,
            isSettingsTourEnabled: false,
            isAnalyticsTourEnabled: false
          })
        );
      }
      dispatch(loginSuccess(loginData));
      if (loginData.settings.speech) {
        if (loginData.settings.speech.pitch) {
          dispatch(changePitch(loginData.settings.speech.pitch));
        }
        if (loginData.settings.speech.rate) {
          dispatch(changeRate(loginData.settings.speech.rate));
        }
        const {
          speech: { voices }
        } = getState();
        if (voices) {
          const uris = voices.map(v => {
            return v.voiceURI;
          });
          if (
            loginData.settings.speech.voiceURI &&
            loginData.settings.language.lang &&
            uris.includes(loginData.settings.speech.voiceURI)
          ) {
            dispatch(
              changeVoice(
                loginData.settings.speech.voiceURI,
                loginData.settings.language.lang
              )
            );
          }
        }
      }
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
