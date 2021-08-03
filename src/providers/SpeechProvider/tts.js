import * as azureSdk from 'microsoft-cognitiveservices-speech-sdk';
import { isAndroid, isCordova } from '../../cordova-util';
import API from '../../api';
import {
  AZURE_SPEECH_SERVICE_REGION,
  AZURE_SPEECH_SUBSCR_KEY
} from '../../constants';
import { getStore } from '../../store';

// this is the local synthesizer
let synth = window.speechSynthesis;

// this is the cloud synthesizer
var azureSynthesizer;

const audioElement = new Audio();
var speakQueue = [];
var platformVoices = [];

const getStateVoices = () => {
  const store = getStore();
  const {
    speech: { voices }
  } = store.getState();
  return voices;
};

const getConnectionStatus = () => {
  const store = getStore();
  const {
    app: { isConnected }
  } = store.getState();
  return isConnected;
};

const initAzureSynthesizer = () => {
  var azureSpeechConfig = azureSdk.SpeechConfig.fromSubscription(
    AZURE_SPEECH_SUBSCR_KEY,
    AZURE_SPEECH_SERVICE_REGION
  );
  var azureAudioConfig = null;
  azureSynthesizer = new azureSdk.SpeechSynthesizer(
    azureSpeechConfig,
    azureAudioConfig
  );
};

const playQueue = () => {
  if (speakQueue.length) {
    const blob = new Blob([speakQueue[0].audioData], { type: 'audio/wav' });
    audioElement.src = window.URL.createObjectURL(blob);
    audioElement.play();
    audioElement.onended = () => {
      window.URL.revokeObjectURL(audioElement.src);
      if (speakQueue.length) {
        speakQueue[0].endCallback();
        speakQueue.shift();
        if (speakQueue.length) {
          playQueue();
        }
      }
    };
  }
};

initAzureSynthesizer();

const tts = {
  isSupported() {
    return 'speechSynthesis' in window;
  },

  getVoiceByVoiceURI(VoiceURI) {
    const voices = getStateVoices();
    return voices.find(voice => voice.voiceURI === VoiceURI);
  },

  isConnected() {
    return getConnectionStatus();
  },

  getLocalVoiceByVoiceURI(VoiceURI) {
    return platformVoices.find(voice => voice.voiceURI === VoiceURI);
  },

  // Get voices depending on platform (browser/cordova)
  _getPlatformVoices() {
    let voices = {};
    try {
      voices = synth.getVoices();
    } catch (err) {
      console.log(err.message);
      synth = window.speechSynthesis;
    }
    // On Cordova, voice results are under `._list`
    return voices._list || voices;
  },

  async getVoices() {
    let cloudVoices = [];
    // first, request for cloud based voices
    try {
      cloudVoices = await API.getAzureVoices();
    } catch (err) {
      console.error(err.message);
    }
    return new Promise((resolve, reject) => {
      platformVoices = this._getPlatformVoices() || [];
      if (platformVoices.length) {
        resolve(platformVoices.concat(cloudVoices));
      }

      // Android
      if ('onvoiceschanged' in synth) {
        synth.addEventListener('voiceschanged', function voiceslst() {
          const voices = synth.getVoices();
          if (!voices.length) {
            return null;
          } else {
            synth.removeEventListener('voiceschanged', voiceslst);
            // On Cordova, voice results are under `._list`
            platformVoices = voices._list || voices;
            resolve(platformVoices.concat(cloudVoices));
          }
        });
      } else if (isCordova()) {
        // Samsung devices on Cordova
        platformVoices = this._getPlatformVoices();
        resolve(platformVoices.concat(cloudVoices));
      }
    });
  },

  //Use setTTsEngine only in Android
  setTtsEngine(ttsEngineName) {
    if (!isAndroid()) {
      return;
    } else {
      //define a race between two promises
      const timeout = (prom, time) => {
        let timer;
        return Promise.race([
          prom,
          new Promise((_r, rej) => (timer = setTimeout(rej, time)))
        ]).finally(() => clearTimeout(timer));
      };
      //promise when setting the TTS succeed
      const ttsResponse = () => {
        return new Promise((resolve, reject) => {
          synth.setEngine(ttsEngineName, function(event) {
            if (event.length) {
              resolve(event);
            }
          });
        });
      };
      // finishes before the timeout
      return timeout(ttsResponse(), 4000);
    }
  },

  //Use getTTsEngine only in Android
  getTtsEngines() {
    if (!isAndroid()) {
      return [];
    } else {
      const ttsEngs = synth.getEngines();
      return ttsEngs._list || [];
    }
  },
  //Use getTTsDefaultEngine only in Android
  getTtsDefaultEngine() {
    if (!isAndroid()) {
      return;
    } else {
      const ttsDefaultEng = synth.getDefaultEngine();
      return ttsDefaultEng;
    }
  },

  cancel() {
    audioElement.pause();
    speakQueue = [];
    synth.cancel();
  },

  async speak(text, { voiceURI, pitch = 1, rate = 1, volume = 1, onend }) {
    const voice = this.getVoiceByVoiceURI(voiceURI);
    if (voice && voice.voiceSource === 'cloud') {
      // set voice to speak
      azureSynthesizer.properties.setProperty(
        'SpeechServiceConnection_SynthVoice',
        voiceURI
      );
      azureSynthesizer.speakTextAsync(
        text,
        function(result) {
          result.endCallback = onend;
          speakQueue.push(result);
          if (
            result.reason === azureSdk.ResultReason.SynthesizingAudioCompleted
          ) {
            // if not playing, play the queue
            if (audioElement.paused) {
              playQueue();
            }
          } else if (result.reason === azureSdk.ResultReason.Canceled) {
            console.error(
              'Speech synthesis canceled, ' +
                result.errorDetails +
                '\nDid you update the subscription info?'
            );
            onend();
            azureSynthesizer.close();
            azureSynthesizer = undefined;
            initAzureSynthesizer();
          }
        },
        function(err) {
          console.error(err);
          onend();
          azureSynthesizer.close();
          azureSynthesizer = undefined;
          initAzureSynthesizer();
        }
      );
    } else {
      if (!platformVoices.length) {
        try {
          await this.getVoices();
        } catch (err) {
          console.error(err.message);
        }
      }
      if (platformVoices.length) {
        const localVoice = this.getLocalVoiceByVoiceURI(voiceURI);
        if (localVoice) {
          const msg = new SpeechSynthesisUtterance(text);
          msg.text = text;
          msg.voice = localVoice;
          msg.name = localVoice.name;
          msg.lang = localVoice.lang;
          msg.voiceURI = localVoice.voiceURI;
          msg.pitch = pitch;
          msg.rate = rate;
          msg.volume = volume;
          msg.onend = onend;
          synth.speak(msg);
        }
      }
    }
  }
};

export default tts;
