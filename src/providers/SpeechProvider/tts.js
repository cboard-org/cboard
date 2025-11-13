import * as azureSdk from 'microsoft-cognitiveservices-speech-sdk';
import { isAndroid, isCordova } from '../../cordova-util';
import API from '../../api';
import {
  AZURE_SPEECH_SERVICE_REGION,
  AZURE_SPEECH_SUBSCR_KEY,
  IS_BROWSING_FROM_APPLE,
  IS_BROWSING_FROM_APPLE_TOUCH,
  IS_BROWSING_FROM_SAFARI
} from '../../constants';
import { getStore } from '../../store';
import { ElevenLabsEngine, validateApiKeyFormat } from './engine/elevenlabs';
import { ELEVEN_LABS } from './SpeechProvider.constants';

// this is the local synthesizer
let synth = window.speechSynthesis;

// this is the cloud synthesizer
var azureSynthesizer;

/**
 * @type {ElevenLabsEngine | null}
 */
let elevenLabsSynthesizer = null;

const audioElement = new Audio();

let appleFirstCloudPlay = IS_BROWSING_FROM_APPLE;
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

const initElevenLabsSynthesizer = apiKey => {
  const getStoreApiKey = () => {
    const store = getStore();
    if (!store) {
      return null;
    }
    const {
      speech: { elevenLabsApiKey }
    } = store.getState();
    return elevenLabsApiKey;
  };

  const elevenLabsApiKey = apiKey || getStoreApiKey();

  if (elevenLabsApiKey && validateApiKeyFormat(elevenLabsApiKey)) {
    return new ElevenLabsEngine(elevenLabsApiKey);
  }
  return null;
};

const initAppleUserAgent = () => {
  if (appleFirstCloudPlay) {
    audioElement
      .play()
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        console.log('Apple user Agent is ready to reproduce cloud voices');
      });
    audioElement.pause();
    appleFirstCloudPlay = false;
  }
};

const playQueue = () => {
  if (speakQueue.length) {
    const blob = new Blob([speakQueue[0].audioData], { type: 'audio/wav' });
    audioElement.src = window.URL.createObjectURL(blob);
    audioElement.play().catch(err => {
      console.error(err);
    });
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

  initElevenLabsInstance(apiKey) {
    elevenLabsSynthesizer = null;
    elevenLabsSynthesizer = initElevenLabsSynthesizer(apiKey);
  },

  async testElevenLabsConnection() {
    if (!elevenLabsSynthesizer) {
      return { isValid: false, error: 'NOT_INITIALIZED' };
    }
    try {
      const result = await elevenLabsSynthesizer.testConnection();
      return result;
    } catch (error) {
      return { isValid: false, error: error.message };
    }
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

  _getPlatformVoices() {
    try {
      const voices = synth.getVoices();
      // On Cordova, voice results are under `._list`
      return voices._list || voices || [];
    } catch (err) {
      console.error('Error getting platform voices:', err.message);
      synth = window.speechSynthesis;
      return [];
    }
  },
  async fetchAzureVoices() {
    try {
      return await API.getAzureVoices();
    } catch (err) {
      console.error('Error fetching Azure voices:', err.message);
      return [];
    }
  },
  async fetchElevenLabsVoices() {
    if (!elevenLabsSynthesizer) {
      return [];
    }

    try {
      const voices = await elevenLabsSynthesizer.getElevenLabsPersonalVoices();
      return voices.map(voice => ({
        voiceURI: voice.voice_id,
        lang: voice.labels?.language || 'en-US',
        name: voice.name,
        voiceSource: ELEVEN_LABS,
        voice_id: voice.voice_id,
        category: voice.category,
        description: voice.description,
        labels: voice.labels,
        settings: {
          stability: 0.5,
          use_speaker_boost: true,
          similarity_boost: 0.75,
          style: 0,
          speed: 1
        }
      }));
    } catch (err) {
      console.error('Error fetching ElevenLabs voices:', err.message);
      return [];
    }
  },
  async getPlatformVoicesAsync() {
    return new Promise(resolve => {
      const VOICES_TIMEOUT = 3000;

      const resolveWithVoices = () => {
        const voices = this._getPlatformVoices();
        platformVoices = voices;
        resolve(voices);
      };

      const initialVoices = this._getPlatformVoices();
      if (initialVoices.length > 0 || isCordova()) {
        platformVoices = initialVoices;
        resolve(initialVoices);
        return;
      }

      const supportsVoicesChanged = 'onvoiceschanged' in synth;
      if (!supportsVoicesChanged) {
        resolveWithVoices();
        return;
      }

      const timeoutId = setTimeout(() => {
        synth.removeEventListener('voiceschanged', handleVoicesChanged);
        resolveWithVoices();
      }, VOICES_TIMEOUT);

      const handleVoicesChanged = () => {
        clearTimeout(timeoutId);
        synth.removeEventListener('voiceschanged', handleVoicesChanged);
        resolveWithVoices();
      };

      synth.addEventListener('voiceschanged', handleVoicesChanged);
    });
  },

  async getVoices() {
    const [
      azureResult,
      elevenLabsResult,
      platformResult
    ] = await Promise.allSettled([
      this.fetchAzureVoices(),
      this.fetchElevenLabsVoices(),
      this.getPlatformVoicesAsync()
    ]);

    const azureVoices =
      azureResult.status === 'fulfilled' ? azureResult.value : [];
    const elevenLabsVoices =
      elevenLabsResult.status === 'fulfilled' ? elevenLabsResult.value : [];
    const platformVoices =
      platformResult.status === 'fulfilled' ? platformResult.value : [];

    return platformVoices.concat(elevenLabsVoices).concat(azureVoices);
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
      if (synth === undefined) {
        synth = window.speechSynthesis;
      }
      const ttsEngs = synth.getEngines() || {};
      return ttsEngs._list || [];
    }
  },
  //Use getTTsDefaultEngine only in Android
  getTtsDefaultEngine() {
    if (!isAndroid()) {
      return;
    } else {
      const ttsDefaultEng = synth.getDefaultEngine() || {};
      return ttsDefaultEng;
    }
  },

  cancel() {
    audioElement.pause();
    speakQueue = [];
    synth.cancel();
  },

  async speak(
    text,
    { voiceURI, pitch = 1, rate = 1, volume = 1, onend },
    setCloudSpeakAlertTimeout
  ) {
    const voice = this.getVoiceByVoiceURI(voiceURI);

    if (voice && voice.voiceSource === ELEVEN_LABS) {
      initAppleUserAgent();
      const speakAlertTimeoutId = setCloudSpeakAlertTimeout();

      const MAX_RETRIES = 2;

      const isRetryableError = error => {
        const message = error.message.toLowerCase();
        const retryableErrors = [
          'rate limit',
          '429',
          'network',
          'fetch',
          'timeout',
          '500',
          '502',
          '503',
          '504'
        ];

        return retryableErrors.some(errorType => message.includes(errorType));
      };

      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

      const store = getStore();
      const {
        speech: { options, elevenLabsVoiceSettings }
      } = store.getState();

      const voiceId = voice.voice_id;
      const voiceSettings = elevenLabsVoiceSettings[voiceId] || {};

      const elevenLabsSettings = {
        stability:
          voiceSettings.stability ?? options.elevenLabsStability ?? 0.5,
        similarity_boost:
          voiceSettings.similarity_boost ??
          options.elevenLabsSimilarity ??
          0.75,
        style: voiceSettings.style ?? options.elevenLabsStyle ?? 0.0,
        speed: rate ?? 1.0
      };

      let success = false;
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          if (attempt > 0) {
            const backoffMs = Math.pow(2, attempt) * 300;
            await delay(backoffMs);
          }

          const audioBlob = await elevenLabsSynthesizer.synthesizeSpeechElevenLabs(
            text,
            voiceURI,
            elevenLabsSettings
          );
          clearTimeout(speakAlertTimeoutId);

          const result = {
            audioData: audioBlob,
            endCallback: onend
          };

          speakQueue.push(result);
          if (audioElement.paused) {
            playQueue();
          }
          success = true;
          break;
        } catch (err) {
          if (attempt === MAX_RETRIES || !isRetryableError(err)) {
            break;
          }
        }
      }

      if (!success) {
        clearTimeout(speakAlertTimeoutId);

        if (!platformVoices.length) {
          try {
            await this.getVoices();
          } catch (voiceErr) {
            console.error(
              'Failed to get voices for fallback:',
              voiceErr.message
            );
          }
        }

        if (platformVoices.length && voice.lang) {
          const fallbackVoice = platformVoices.find(
            v => v.lang && v.lang.substring(0, 2) === voice.lang.substring(0, 2)
          );

          if (fallbackVoice) {
            const msg = new SpeechSynthesisUtterance(text);
            msg.text = text;
            msg.voice = fallbackVoice;
            msg.name = fallbackVoice.name;
            msg.lang = fallbackVoice.lang;
            msg.voiceURI = fallbackVoice.voiceURI;
            msg.pitch = pitch;
            msg.rate = rate;
            msg.volume = volume;
            msg.onend = onend;
            if (IS_BROWSING_FROM_SAFARI || IS_BROWSING_FROM_APPLE_TOUCH)
              synth.cancel();
            synth.speak(msg);
            return;
          }
        }

        onend({ error: true });
      }
    } else if (voice && voice.voiceSource === 'cloud') {
      initAppleUserAgent();
      const speakAlertTimeoutId = setCloudSpeakAlertTimeout();
      // set voice to speak
      azureSynthesizer.properties.setProperty(
        'SpeechServiceConnection_SynthVoice',
        voiceURI
      );
      azureSynthesizer.speakTextAsync(
        text,
        function(result) {
          result.endCallback = onend;
          clearTimeout(speakAlertTimeoutId);
          if (
            result.reason === azureSdk.ResultReason.SynthesizingAudioCompleted
          ) {
            speakQueue.push(result);
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
            onend({ error: true });
            azureSynthesizer.close();
            azureSynthesizer = undefined;
            initAzureSynthesizer();
          }
        },
        function(err) {
          console.error(err);
          onend({ error: true });
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
          if (IS_BROWSING_FROM_SAFARI || IS_BROWSING_FROM_APPLE_TOUCH)
            synth.cancel();
          synth.speak(msg);
        }
      }
    }
  }
};

export default tts;
