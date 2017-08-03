import { getStore } from '../store';

const synth = window.speechSynthesis;
let voices = [];

const speech = {
  getVoiceByLocale(locale) {
    return this.getVoices().then(voices => {
      voices.find(voice => voice.lang.slice(0, 2) === locale);
    });
  },

  getLocales() {
    return this.getVoices().then(voices => {
      const locales = [];
      voices.forEach(voice => {
        const locale = voice.lang.slice(0, 2);

        if (!locales.includes(locale)) {
          locales.push(locale);
        }
      });
      return locales;
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
      if ('onvoiceschanged' in window.speechSynthesis) {
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

  speak(text) {
    Promise.all([this.getVoices(), getStore()]).then(([voices, store]) => {
      const { lang, voiceURI, pitch, rate, volume } = store.getState().speech;
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = text;
      utterance.voice = voices.filter(voice => voice.voiceURI === voiceURI)[0];
      utterance.volume = volume;
      utterance.lang = lang;
      utterance.pitch = pitch;
      utterance.rate = rate;
      synth.speak(utterance);
    });
  }
};

export default speech;
