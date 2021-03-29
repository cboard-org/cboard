import { isCordova } from '../../cordova-util';

// `window.speechSynthesis` is present when running inside cordova
let synth = window.speechSynthesis;
let currentVoices = [];

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

  getVoices() {
    return new Promise((resolve, reject) => {
      currentVoices = this._getPlatformVoices();

      // iOS
      if (currentVoices.length) {
        resolve(currentVoices);
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
            currentVoices = voices._list || voices;
            resolve(currentVoices);
          }
        });
      } else if (isCordova()) {
        // Samsung devices on Cordova
        currentVoices = this._getPlatformVoices();
        resolve(currentVoices);
      }
    });
  },

  setTtsEngine(ttsEngineName) {
    if (!isCordova()) {
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

  getTtsEngines() {
    if (!isCordova()) {
      return [];
    } else {
      const ttsEngs = synth.getEngines();
      return ttsEngs._list || [];
    }
  },

  getTtsDefaultEngine() {
    if (!isCordova()) {
      return;
    } else {
      const ttsDefaultEng = synth.getDefaultEngine();
      return ttsDefaultEng;
    }
  },

  cancel() {
    synth.cancel();
  },

  speak(text, { voiceURI, pitch = 1, rate = 1, volume = 1, onend }) {
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
};

export default tts;
