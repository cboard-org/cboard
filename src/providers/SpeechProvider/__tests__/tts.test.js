import tts from '../tts';
import { normalizeLanguageCode } from '../../../i18n';

let voices = [
  { voiceURI: "Google Deutsch", lang: "de-DE", name: "Google Deutsch" },
  { voiceURI: "Google US English", lang: "en-US", name: "Google US English" },
  { voiceURI: "Google UK English Female", lang: "en-GB", name: "Google UK English Female" },
  { voiceURI: "Google UK English Male", lang: "en-GB", name: "Google UK English Male" },
  { voiceURI: "Google español", lang: "es-ES", name: "Google español" }
];

describe('tts', () => {
  it('check normalizeVoices', () => {
    expect(tts.normalizeVoices(voices)).toEqual(voices);
  }); 
  it('check isSupported', () => {
    expect(tts.isSupported()).toEqual(true);
  });
  it('check getVoices', () => {
    tts.getVoices()
      .then(data => expect(data).toEqual(voices))
      .catch(e => { throw new Error(e.message) });
  });
  it('check getLangs', () => {
    const langs = ["de-DE", "en-US", "en-GB", "es-ES"];
    tts.getLangs()
      .then(data => expect(data).toEqual(langs))
      .catch(e => { throw new Error(e.message) });
  });
  it('check getVoiceByVoiceURI', () => {
    const uri = "Google español";
    tts.getVoiceByVoiceURI(uri)
      .then(data => expect(data).toEqual(voices[4]))
      .catch(e => { throw new Error(e.message) });
  });
  it('check getVoiceByLang', () => {
    const lang = "de-DE";
    tts.getVoiceByLang(lang)
      .then(data => expect(data).toEqual(voices[0]))
      .catch(e => { throw new Error(e.message) });
  });
  it('check cancel', () => {
    expect(tts.cancel()).toBeUndefined();
  });
});
