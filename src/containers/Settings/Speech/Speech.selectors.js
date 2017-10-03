import R from 'ramda';
import { createStructuredSelector, createSelector } from 'reselect';

// Every selector is a function that gets `state` as a parameter (and `props` but e try not to abuse that).
// Typically we will start by pulling some root data object from the state, them compose increasingly complex layers

// Writing it the "from scratch" way:
const selectSpeechSettingsScratch = state => state.speech;

// Writing is the functional way:
const selectSpeechSettings = R.prop('speech');
// this is equivalent to: state => R.prop('speech')(state)
// but we can take advantage of Ramda's functional structure to tidy things up

// You can compose and re-use selectors:
const selectVoiceOptions = createSelector(
  selectSpeechSettings, // input selector (there can be any number of these, a...n)
  R.propOr([], 'voices') // Result function that gets the result of the iinput selectors as parameters and calculates final ouput
);
const selectVoiceUri = createSelector(
  selectSpeechSettings,
  R.propOr('', 'voiceURI')
);
const selectVoicePitch = createSelector(
  selectSpeechSettings,
  R.propOr(1, 'pitch')
);
const selectVoiceRate = createSelector(
  selectSpeechSettings,
  R.propOr(1, 'rate')
);

const selectLanguage = R.prop('language');
const selectLocale = createSelector(selectLanguage, R.propOr('', 'locale'));

const speechSettingsConnector = createStructuredSelector({
  locale: selectLocale,
  voices: selectVoiceOptions,
  voiceURI: selectVoiceUri,
  pitch: selectVoicePitch,
  rate: selectVoiceRate
});

export default speechSettingsConnector;
