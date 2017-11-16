import {
  CHANGE_VOICE,
  CHANGE_PITCH,
  CHANGE_RATE
} from './SpeechProvider.constants';

const changeVoice = (action, prevState, nextState) => ({
  hitType: 'event',
  eventCategory: 'Speech',
  eventAction: 'Changed Voice',
  eventLabel: action.voiceURI
});

const changePitch = (action, prevState, nextState) => ({
  hitType: 'event',
  eventCategory: 'Speech',
  eventAction: 'Changed Pitch',
  eventLabel: action.pitch
});

const changeRate = (action, prevState, nextState) => ({
  hitType: 'event',
  eventCategory: 'Speech',
  eventAction: 'Changed Rate',
  eventLabel: action.rate
});

const eventsMap = {
  [CHANGE_VOICE]: changeVoice,
  [CHANGE_PITCH]: changePitch,
  [CHANGE_RATE]: changeRate
};

export default eventsMap;
