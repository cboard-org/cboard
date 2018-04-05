import { trackEvent } from '@redux-beacon/google-analytics-gtag';

import {
  CHANGE_VOICE,
  CHANGE_PITCH,
  CHANGE_RATE
} from './SpeechProvider.constants';

const changeVoice = trackEvent((action, prevState, nextState) => ({
  category: 'Speech',
  action: 'Changed Voice',
  label: action.voiceURI
}));

const changePitch = trackEvent((action, prevState, nextState) => ({
  category: 'Speech',
  action: 'Changed Pitch',
  label: action.pitch
}));

const changeRate = trackEvent((action, prevState, nextState) => ({
  category: 'Speech',
  action: 'Changed Rate',
  label: action.rate
}));

const eventsMap = {
  [CHANGE_VOICE]: changeVoice,
  [CHANGE_PITCH]: changePitch,
  [CHANGE_RATE]: changeRate
};

export default eventsMap;
