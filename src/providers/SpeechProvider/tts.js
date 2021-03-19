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
    } catch (err) {
      console.log(err.message);
      synth = window.speechSynthesis;
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
            resolve(cachedVoices);
          }
        });
      } else if (isCordova()) {
        // Samsung devices on Cordova
        cachedVoices = this._getPlatformVoices();
        resolve(cachedVoices);
      }
    });
  },

  setTtsEngine(ttsEngineName) {
    if (!isCordova()) {
      return;
    } else {
      return new Promise((resolve, reject) => {
        synth.setEngine(ttsEngineName, function(event) {
          console.log(event);
          if (event.length) {
            resolve(event);
          }
        });
      });
    }
  },

  getTtsEngines() {
    if (!isCordova()) {
      return [];
    } else {
      const ttsEngs = synth.getEngines();
      console.log(ttsEngs);
      return ttsEngs._list || [];
    }
    /*     return [
    
          { name: "com.samsung.SMT", label: "Motor de texto a voz de Samsung", icon: 2131230811 },
          { name: "com.google.android.tts", label: "Motor de texto a voz de Google", icon: 2131558400 },
          { name: "alfanum.co.rs.alfanumtts.lite", label: "AlfanumTTS Lite", icon: 2131361792 },
          { name: "alfanum.co.rs.alfanumtts.lite.cro", label: "AlfanumTTS Lite CRO", icon: 2131361792 },
          { name: "alfanum.co.rs.alfanumtts.lite.mne", label: "AlfanumTTS Lite MNE", icon: 2131361792 }
        ] */
  },

  getTtsDefaultEngine() {
    if (!isCordova()) {
      return {
        name: 'com.google.android.tts',
        label: 'Motor de texto a voz de Google',
        icon: 2131558400
      };
    } else {
      const ttsDefaultEng = synth.getDefaultEngine();
      console.log(ttsDefaultEng);
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
