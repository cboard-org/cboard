import API from '../../../api';
import { LOGIN_SUCCESS, LOGOUT } from './Login.constants';
import { addBoards } from '../../Board/Board.actions';
import {
  changeVoice,
  changePitch,
  changeRate
} from '../../../providers/SpeechProvider/SpeechProvider.actions';
import { disableTour } from '../../App/App.actions';
import { getVoiceURI } from '../../../i18n';

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
  const setAVoice = ({ loginData, dispatch, getState }) => {
    const {
      speech: {
        voices,
        options: { lang: voiceLang, voiceURI: browserVoiceUri }
      }
    } = getState(); //ATENTION speech options on DB is under Speech directly. on state is under options

    const loginLanguage = loginData.settings?.language?.lang;
    const userLanguage = loginLanguage?.substring(0, 2);
    const browserVoiceLanguage = voiceLang?.substring(0, 2);

    if (voices) {
      const uris = voices.map(v => {
        return v.voiceURI;
      });
      //if redux state have a defined voiceUri. Set it By default
      if (
        browserVoiceUri &&
        browserVoiceLanguage === userLanguage &&
        uris.include(browserVoiceUri)
      ) {
        dispatch(changeVoice(browserVoiceUri, voiceLang));
        return;
      }
      //if not Try to use API stored Voice
      if (loginData.settings.speech) {
        const userVoiceUri = loginData.settings.speech.voiceURI; //ATENTION speech options on DB is under Speech directly. on state is under options

        const userVoiceLang = voices.filter(
          voice => voice.voiceURI === userVoiceUri
        )[0]?.voiceURI;

        const userVoiceLanguage = userVoiceLang.substring(0, 2);

        if (
          userVoiceUri &&
          userLanguage === userVoiceLanguage &&
          uris.includes(userVoiceUri)
        ) {
          dispatch(changeVoice(userVoiceUri, loginLanguage));
          if (loginData.settings.speech.pitch) {
            dispatch(changePitch(loginData.settings.speech.pitch));
          }
          if (loginData.settings.speech.rate) {
            dispatch(changeRate(loginData.settings.speech.rate));
          }
          return;
        }
      } //if the voice is unavailable. Set default voice
      dispatch(changeVoice(getVoiceURI(loginLanguage, voices), loginLanguage));
      return;
    }
  };

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
      setAVoice({ loginData, dispatch, getState });
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
