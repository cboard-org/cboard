import * as actions from '../SpeechProvider.actions';
import * as types from '../SpeechProvider.constants';

describe('actions', () => {
  it('should create an action to request voices', () => {
    const expectedAction = {
      type: types.REQUEST_VOICES
    };
    expect(actions.requestVoices()).toEqual(expectedAction);
  });

  it('should create an action to receive voices', () => {
    const voices = [{}, {}];
    const expectedAction = {
      type: types.RECEIVE_VOICES,
      voices
    };
    expect(actions.receiveVoices(voices)).toEqual(expectedAction);
  });

  it('should create an action to change voice', () => {
    const voiceURI = 'Shay Hebrew Voice';
    const lang = 'he';

    const expectedAction = {
      type: types.CHANGE_VOICE,
      voiceURI,
      lang
    };

    expect(actions.changeVoice(voiceURI, lang)).toEqual(expectedAction);
  });

  it('should create an action to change pitch', () => {
    const pitch = 2;
    const expectedAction = {
      type: types.CHANGE_PITCH,
      pitch
    };
    expect(actions.changePitch(pitch)).toEqual(expectedAction);
  });

  it('should create an action to change rate', () => {
    const rate = 2;
    const expectedAction = {
      type: types.CHANGE_RATE,
      rate
    };
    expect(actions.changeRate(rate)).toEqual(expectedAction);
  });
});
