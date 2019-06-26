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
});
