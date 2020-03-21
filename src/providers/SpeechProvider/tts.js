import { isCordova } from '../../cordova-util';

// `window.speechSynthesis` is present when running inside cordova
let synth = window.speechSynthesis;
let cachedVoices = [];

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
      console.log(voices);
    } catch (err) {
      console.log(err.message);
      synth = window.speechSynthesis;
    }
    // On Cordova, voice results are under `._list`
    return voices._list || voices;
  },

  getVoices() {
    if (cachedVoices.length) {
      console.log('get voices 1 ');
      return Promise.resolve(cachedVoices);
    }

    return new Promise((resolve, reject) => {
      cachedVoices = this._getPlatformVoices();

      // iOS
      if (cachedVoices.length) {
        console.log('get voices 2 ');
        resolve(cachedVoices);
      }

      // Android
      if ('onvoiceschanged' in synth) {
        synth.addEventListener('voiceschanged', function voiceslst() {
          const voices = synth.getVoices();
          if (!voices.length) {
            console.log('get voices 3 ');
            return null;
          } else {
            synth.removeEventListener('voiceschanged', voiceslst);
            // On Cordova, voice results are under `._list`
            cachedVoices = voices._list || voices;
            console.log('get voices 4 ');
            resolve(cachedVoices);
          }
        });
      } else if (isCordova()) {
        // Samsung devices on Cordova
        cachedVoices = this._getPlatformVoices();
        console.log('get voices 5 ');
        resolve(cachedVoices);
      }
    });
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
