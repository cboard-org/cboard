import { trackEvent } from '@redux-beacon/google-analytics-gtag';

import {
  CHANGE_VOICE,
  CHANGE_PITCH,
  CHANGE_RATE,
  START_SPEECH,
  EMPTY_VOICES
} from './SpeechProvider.constants';
import {
  cvaTrackEvent,
  isElectron,
  isAndroid,
  isIOS
} from '../../cordova-util';
import ga4track from '../../ga4mp';

const changeVoice = trackEvent((action, prevState, nextState) => {
  const gaEvent = {
    category: 'Speech',
    action: 'Changed Voice',
    label: action ? action.voiceURI : EMPTY_VOICES
  };
  if (isAndroid() || isIOS()) {
    cvaTrackEvent(gaEvent.category, gaEvent.action, gaEvent.label);
  }
  if (isElectron()) {
    ga4track.trackEvent(gaEvent.action, {
      event_category: gaEvent.category,
      event_label: gaEvent.label
    });
  }
  return gaEvent;
});

const changePitch = trackEvent((action, prevState, nextState) => {
  const gaEvent = {
    category: 'Speech',
    action: 'Changed Pitch',
    label: action.pitch
  };
  if (isAndroid() || isIOS()) {
    cvaTrackEvent(gaEvent.category, gaEvent.action, gaEvent.label);
  }
  if (isElectron()) {
    ga4track.trackEvent(gaEvent.action, {
      event_category: gaEvent.category,
      event_label: gaEvent.label
    });
  }
  return gaEvent;
});

const changeRate = trackEvent((action, prevState, nextState) => {
  const gaEvent = {
    category: 'Speech',
    action: 'Changed Rate',
    label: action.rate
  };
  if (isAndroid() || isIOS()) {
    cvaTrackEvent(gaEvent.category, gaEvent.action, gaEvent.label);
  }
  if (isElectron()) {
    ga4track.trackEvent(gaEvent.action, {
      event_category: gaEvent.category,
      event_label: gaEvent.label
    });
  }
  return gaEvent;
});

const startSpeech = trackEvent((action, prevState, nextState) => {
  const gaEvent = {
    category: 'Speech',
    action: 'Start Speech',
    label: action.text
  };
  if (isAndroid() || isIOS()) {
    cvaTrackEvent(gaEvent.category, gaEvent.action, gaEvent.label);
  }
  if (isElectron()) {
    ga4track.trackEvent(gaEvent.action, {
      event_category: gaEvent.category,
      event_label: gaEvent.label
    });
  }
  return gaEvent;
});

const eventsMap = {
  [CHANGE_VOICE]: changeVoice,
  [CHANGE_PITCH]: changePitch,
  [CHANGE_RATE]: changeRate,
  [START_SPEECH]: startSpeech
};

export default eventsMap;
