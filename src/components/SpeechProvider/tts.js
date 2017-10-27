import { normalizeLanguageCode } from '../../i18n';

const synth = window.speechSynthesis;
let voices = [];

const tts = {
  getVoiceByLang(lang) {
    return this.getVoices().then(voices => {
      voices.find(voice => normalizeLanguageCode(voice.lang) === lang);
    });
  },

  getLangs() {
    return this.getVoices().then(voices => {
      const langs = [];
      voices.forEach(voice => {
        const lang = normalizeLanguageCode(voice.lang);

        if (!langs.includes(lang)) {
          langs.push(lang);
        }
      });
      return langs;
    });
  },

  getVoices() {
    if (voices.length) {
      return Promise.resolve(voices);
    }

    return new Promise((resolve, reject) => {
      // iOS
      voices = synth.getVoices() || [];
      if (voices.length) {
        resolve(voices);
      }

      // Android
      if ('onvoiceschanged' in synth) {
        speechSynthesis.onvoiceschanged = () => {
          voices = synth.getVoices();
          resolve(voices);
        };
      }
    });
  },

  cancel() {
    synth.cancel();
  },

  speak(text, options) {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = options.onend;
      synth.speak(utterance);
    });
  }
};

export default tts;
