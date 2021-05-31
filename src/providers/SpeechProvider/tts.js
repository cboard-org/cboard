import * as azureSdk from 'microsoft-cognitiveservices-speech-sdk';
import { isAndroid, isCordova } from '../../cordova-util';
import API from '../../api';
import {
  AZURE_SPEECH_SERVICE_REGION,
  AZURE_SPEECH_SUBSCR_KEY
} from '../../constants';

// this is the local synthesizer
let synth = window.speechSynthesis;

var azonend;

// this is the cloud synthesizer
var azureSpeechConfig = azureSdk.SpeechConfig.fromSubscription(
  AZURE_SPEECH_SUBSCR_KEY,
  AZURE_SPEECH_SERVICE_REGION
);
var player = new azureSdk.SpeakerAudioDestination();
player.onAudioEnd = function() {
  console.log('playback finished');
  azonend();
};
var azureAudioConfig = azureSdk.AudioConfig.fromSpeakerOutput(player);
var azureSynthesizer = new azureSdk.SpeechSynthesizer(
  azureSpeechConfig,
  azureAudioConfig
);

const tts = {
  isSupported() {
    return 'speechSynthesis' in window;
  },

  getVoiceByLang(lang) {
    return this.getVoices().then(voices =>
      voices.find(voice => voice.lang === lang)
    );
  },

  getVoiceByVoiceURI(VoiceURI) {
    return this.getVoices().then(voices => {
      if (voices.length > 0) {
        return voices.find(voice => voice.voiceURI === VoiceURI);
      } else {
        return null;
      }
    });
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
    // first, request for cloud based voices
    let cloudVoices = await API.getAzureVoices();
    return new Promise((resolve, reject) => {
      let platformVoices = this._getPlatformVoices() || [];
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
    synth.cancel();
  },

  speak(
    text,
    { voiceURI, voiceSource = 'local', pitch = 1, rate = 1, volume = 1, onend }
  ) {
    if (voiceSource === 'cloud') {
      azonend = onend;
      azureSynthesizer.properties.setProperty(
        'SpeechServiceConnection_SynthVoice',
        voiceURI
      );
      azureSynthesizer.speakTextAsync(
        text,
        function(result) {
          if (result.reason === azureSdk.ResultReason.Canceled) {
            console.log(result.errorDetails);
          }
          //azureSynthesizer.close();
          //azureSynthesizer = undefined;
        },
        function(err) {
          console.log(err);
          onend();
          //azureSynthesizer.close();
          //azureSynthesizer = undefined;
        }
      );
    } else {
      this.getVoiceByVoiceURI(voiceURI).then(voice => {
        const msg = new SpeechSynthesisUtterance(text);
        msg.text = text;
        msg.voice = voice;
        msg.name = voice.name;
        msg.lang = voice.lang;
        msg.voiceURI = voice.voiceURI;
        msg.pitch = pitch;
        msg.rate = rate;
        msg.volume = volume;
        msg.onend = onend;
        synth.speak(msg);
      });
    }
  }
};

export default tts;
