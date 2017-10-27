let voices = [];

const tts = {
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
      voices = window.speechSynthesis.getVoices() || [];
      if (voices.length) {
        resolve(voices);
      }

      // Android
      if ('onvoiceschanged' in window.speechSynthesis) {
        speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          resolve(voices);
        };
      }
    });
  },

  cancel() {
    window.speechSynthesis.cancel();
  },

  speak(text, options) {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = options.onend;
      window.speechSynthesis.speak(utterance);
    });
  }
};

export default tts;
