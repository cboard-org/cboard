import { normalizeLanguageCode } from '../../i18n';

// `window.speechSynthesis` is present when running inside cordova
const synth = global.window.speechSynthesis || window.speechSynthesis;
let cachedVoices = [];

const tts = {
  isSupported() {
    return 'speechSynthesis' in window;
  },

  normalizeVoices(voices) {
    return voices.map(({ voiceURI, name, lang }) => ({
      voiceURI,
      name,
      lang: normalizeLanguageCode(lang)
    }));
  },

  getVoiceByLang(lang) {
    return this.getVoices().then(voices =>
      voices.find(voice => voice.lang === lang)
    );
  },

  getVoiceByVoiceURI(VoiceURI) {
    return this.getVoices().then(voices =>
      voices.find(voice => voice.voiceURI === VoiceURI)
    );
  },

  getLangs() {
    return this.getVoices().then(voices => {
      const langs = [...new Set(voices.map(voice => voice.lang))];
      return langs;
    });
  },

  // Get voices depending on platform (browser/cordova)
  _getPlatformVoices() {
    const voices = synth.getVoices() || [];

    // On Cordova, voice results are under `._list`
    return voices._list || voices;
  },

  getVoices() {
    if (cachedVoices.length) {
      return Promise.resolve(cachedVoices);
    }

    return new Promise((resolve, reject) => {
      cachedVoices = this._getPlatformVoices();

      // iOS
      if (cachedVoices.length) {
        resolve(this.normalizeVoices(cachedVoices));
      }

      // Android
      if ('onvoiceschanged' in synth) {
        speechSynthesis.onvoiceschanged = () => {
          cachedVoices = this._getPlatformVoices();
          resolve(this.normalizeVoices(cachedVoices));
        };
      }
    });
  },

  cancel() {
    synth.cancel();
  },

  speak(text, { voiceURI, pitch = 1, rate = 1, volume = 1, onend }) {
    this.getVoiceByVoiceURI(voiceURI).then(voice => {
      const msg = new SpeechSynthesisUtterance(text);
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
