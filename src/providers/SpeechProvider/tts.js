import { normalizeLanguageCode, standardizeLanguageCode } from '../../i18n';

// `window.speechSynthesis` is present when running inside cordova
const synth = window.speechSynthesis;
let cachedVoices = [];

const tts = {
  isSupported() {
    return 'speechSynthesis' in window;
  },

  standardizeVoices(voices) {
    return voices.map(({ voiceURI, name, lang }) => ({
      voiceURI,
      name,
      lang: standardizeLanguageCode(lang)
    }));
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
    const synth = window.speechSynthesis;
    let voices = {};
    try {
      voices = synth.getVoices();
    } catch (err) {
      console.log(err.message);
    }
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
        cachedVoices = this.normalizeVoices(
          this.standardizeVoices(cachedVoices)
        );
        resolve(cachedVoices);
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
            cachedVoices = voices._list || voices;
            let nVoices = cachedVoices.map(({ voiceURI, name, lang }) => ({
              voiceURI,
              name,
              lang: normalizeLanguageCode(lang)
            }));
            resolve(nVoices);
          }
        });
      } else {
        // Samsung devices on Cordova
        const sVoices = this._getPlatformVoices();
        cachedVoices = this.normalizeVoices(this.standardizeVoices(sVoices));
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
