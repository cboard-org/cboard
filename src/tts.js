// todo new tts service with more options for pitch/rate and voices

const TTS = ((window) => {
  let CONF = {
    voice: '',
    volume: 1,
    rate: 1,
    pitch: 1,
    onVoicesLoaded: () => { },
  };

  let voices = null;

  const init = (conf) => {
    if (conf) { CONF = Object.assign(CONF, conf); }

    if ('onvoiceschanged' in window.speechSynthesis) {
      speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();

        if (CONF.onVoicesLoaded) {
          CONF.onVoicesLoaded(voices);
        }
      };
    }
  };

  const setVoice = (voice) => {
    CONF.voice = voice;
    CONF.voice = init().filter(v => v.name === voice.name);
  };

  const setRate = (rate) => {
    CONF.rate = rate;
  };

  const setPitch = (pitch) => {
    CONF.pitch = pitch;
  };

  const speak = ({ text, onEnd, onError }) => {
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.voice = CONF.voice;
    msg.volume = CONF.volume;
    msg.rate = CONF.rate;
    msg.pitch = CONF.pitch;

    window.speechSynthesis.speak(msg);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
  };

  return {
    init,
    setVoice,
    setRate,
    setPitch,
    speak,
    stop,
  };
})(window);

export default TTS;
