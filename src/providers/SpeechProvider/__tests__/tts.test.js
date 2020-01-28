import tts from '../tts';
import { normalizeLanguageCode } from '../../../i18n';

let voices = [
  { voiceURI: 'Google Deutsch', lang: 'de-DE', name: 'Google Deutsch' },
  { voiceURI: 'Google US English', lang: 'en-US', name: 'Google US English' },
  {
    voiceURI: 'Google UK English Female',
    lang: 'en-GB',
    name: 'Google UK English Female'
  },
  {
    voiceURI: 'Google UK English Male',
    lang: 'en-GB',
    name: 'Google UK English Male'
  },
  { voiceURI: 'Google español', lang: 'es-ES', name: 'Google español' }
];

describe('tts', () => {
  it('check isSupported', () => {
    expect(tts.isSupported()).toEqual(true);
  });
  it('check getVoices', async () => {
    const data = await tts.getVoices();
    expect(data).toEqual(voices);
  });
  it('check getLangs', async () => {
    const langs = ['de-DE', 'en-US', 'en-GB', 'es-ES'];
    const data = await tts.getLangs();
    expect(data).toEqual(langs);
  });
  it('check getVoiceByVoiceURI', async () => {
    const uri = 'Google español';
    const data = await tts.getVoiceByVoiceURI(uri);
    expect(data).toEqual(voices[4]);
  });
  it('check getVoiceByLang', async () => {
    const lang = 'de-DE';
    const data = await tts.getVoiceByLang(lang);
    data => expect(data).toEqual(voices[0]);
  });
  it('check speak', () => {
    const lang = 'de-DE';
    const param = { voiceURI: 'Google español' };
    tts.speak('hello', param);
  });
  it('check cancel', () => {
    expect(tts.cancel()).toBeUndefined();
  });
});
