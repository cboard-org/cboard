import tts from '../tts';

let mockVoices = [
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
  it('check speak', () => {
    const lang = 'de-DE';
    const param = { voiceURI: 'Google español' };
    tts.speak('hello', param);
  });
  it('check cancel', () => {
    expect(tts.cancel()).toBeUndefined();
  });
});
