import { normalizeLanguageCode } from '../../i18n';

const synth = window.speechSynthesis;
let voices = [];

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

  getVoices() {
    if (voices.length) {
      return Promise.resolve(voices);
    }

    return new Promise((resolve, reject) => {
      // iOS
      voices = synth.getVoices() || [];
      if (voices.length) {
        resolve(this.normalizeVoices(voices));
      }

      // Android
      if ('onvoiceschanged' in synth) {
        speechSynthesis.onvoiceschanged = () => {
          voices = synth.getVoices();
          resolve(this.normalizeVoices(voices));
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
