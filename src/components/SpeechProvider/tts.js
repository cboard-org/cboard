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

  speak(text) {
    Promise.all([this.getVoices()]).then(([voices, store]) => {
      const { lang, voiceURI, pitch, rate, volume } = store.getState().speech;
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = text;
      utterance.voice = voices.filter(voice => voice.voiceURI === voiceURI)[0];
      utterance.volume = volume;
      utterance.lang = lang;
      utterance.pitch = pitch;
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    });
  }
};

export default tts;
