import * as i18n from '../i18n';

describe('i18n', () => {
  it('should strip Region Code', () => {
    expect(i18n.stripRegionCode('es-ES')).toBe('es');
  });
  it('should normalize Language Code', () => {
    expect(i18n.normalizeLanguageCode('ES-ES')).toBe('es-ES');
    expect(i18n.normalizeLanguageCode('es-es')).toBe('es-ES');
  });
  it('should normalize Language Code for two', () => {
    expect(i18n.normalizeLanguageCode('ES')).toBe('es');
    expect(i18n.normalizeLanguageCode('es')).toBe('es');
  });
});

import { getVoiceURI } from '../i18n';
import { EMPTY_VOICES } from '../providers/SpeechProvider/SpeechProvider.constants';

const makeVoice = (voiceURI, lang) => ({
  voiceURI,
  name: `name of ${voiceURI}`,
  lang
});

describe('getVoiceURI', () => {
  describe('when there is no compatible voice', () => {
    it('should return EMPTY_VOICES when the voices list is empty', () => {
      const language = 'en';
      const voices = [];

      const result = getVoiceURI(language, voices);

      expect(result).toBe(EMPTY_VOICES);
    });

    it('should return EMPTY_VOICES when the voices list is empty even if language is not a string', () => {
      const language = 42;
      const voices = [];

      const result = getVoiceURI(language, voices);

      expect(result).toBe(EMPTY_VOICES);
    });

    it('should return EMPTY_VOICES when no voice shares the first two letters of the language', () => {
      const language = 'en';
      const voices = [
        makeVoice('v-es', 'es-ES'),
        makeVoice('v-eu', 'eu-ES'),
        makeVoice('v-sn', 'sn-ZW')
      ];

      const result = getVoiceURI(language, voices);

      expect(result).toBe(EMPTY_VOICES);
    });

    it('should return EMPTY_VOICES when language is uppercase, because language is not standardized', () => {
      const language = 'EN';
      const voices = [makeVoice('v-en', 'en-US')];

      const result = getVoiceURI(language, voices);

      expect(result).toBe(EMPTY_VOICES);
    });

    it('should return EMPTY_VOICES for pt-TL when there is no Portuguese voice', () => {
      const language = 'pt-TL';
      const voices = [makeVoice('v-en', 'en-US'), makeVoice('v-es', 'es-ES')];

      const result = getVoiceURI(language, voices);

      expect(result).toBe(EMPTY_VOICES);
    });
  });

  describe('when there is a compatible voice', () => {
    it('should return the voiceURI of the only compatible voice for a language without region', () => {
      const language = 'en';
      const voices = [makeVoice('v-en', 'en-US')];

      const result = getVoiceURI(language, voices);

      expect(result).toBe('v-en');
    });

    it('should return a compatible voice that comes after an incompatible one', () => {
      const language = 'en';
      const voices = [makeVoice('v-es', 'es-ES'), makeVoice('v-en', 'en-US')];

      const result = getVoiceURI(language, voices);

      expect(result).toBe('v-en');
    });

    it('should ignore the region and match only by the language code', () => {
      const language = 'en-GB';
      const voices = [makeVoice('v-us', 'en-US')];

      const result = getVoiceURI(language, voices);

      expect(result).toBe('v-us');
    });

    it('should accept a voice whose lang uses underscore as separator', () => {
      const language = 'pt-BR';
      const voices = [makeVoice('v-en', 'en-US'), makeVoice('v-br', 'pt_BR')];

      const result = getVoiceURI(language, voices);

      expect(result).toBe('v-br');
    });

    it('should accept a voice whose lang has inverted letter case', () => {
      const language = 'en';
      const voices = [
        makeVoice('v-fr', 'fr-FR'),
        makeVoice('v-en', 'EN-us'),
        makeVoice('v-es', 'es-ES')
      ];

      const result = getVoiceURI(language, voices);

      expect(result).toBe('v-en');
    });

    it('should convert a three-letter voice lang (language and country) to its two-letter equivalent', () => {
      const language = 'en';
      const voices = [makeVoice('v1', 'eng-USA'), makeVoice('v2', 'en-US')];

      const result = getVoiceURI(language, voices);

      expect(result).toBe('v1');
    });

    it('should convert a three-letter voice lang without region to its two-letter equivalent', () => {
      const language = 'en';
      const voices = [makeVoice('v-eng', 'eng')];

      const result = getVoiceURI(language, voices);

      expect(result).toBe('v-eng');
    });

    it('should use the first two letters of a three-letter voice lang that has no two-letter equivalent', () => {
      const language = 'fi';
      const voices = [makeVoice('v-fil', 'fil-PH')];

      const result = getVoiceURI(language, voices);

      expect(result).toBe('v-fil');
    });

    it('should match a voice lang without region when language has region', () => {
      const language = 'es-ES';
      const voices = [makeVoice('v-es', 'es')];

      const result = getVoiceURI(language, voices);

      expect(result).toBe('v-es');
    });

    it('should return the first compatible voice when several voices are compatible', () => {
      const language = 'pt-BR';
      const voices = [
        makeVoice('v-fr', 'fr-FR'),
        makeVoice('v-pt', 'pt-PT'),
        makeVoice('v-br', 'pt-BR')
      ];

      const result = getVoiceURI(language, voices);

      expect(result).toBe('v-pt');
    });

    it('should not modify the voices received as argument', () => {
      const voices = [makeVoice('v-br', 'pt_BR')];
      const snapshot = JSON.parse(JSON.stringify(voices));

      getVoiceURI('pt-BR', voices);

      expect(voices).toEqual(snapshot);
    });
  });

  describe('special case for Tetum (pt-TL)', () => {
    it('should return the Portuguese (Portugal) voice for pt-TL', () => {
      const language = 'pt-TL';
      const voices = [makeVoice('v-en', 'en-US'), makeVoice('v-pt', 'pt-PT')];

      const result = getVoiceURI(language, voices);

      expect(result).toBe('v-pt');
    });

    it('should return the Portuguese (Brazil) voice for pt-TL when there is no pt-PT voice', () => {
      const language = 'pt-TL';
      const voices = [makeVoice('v-en', 'en-US'), makeVoice('v-br', 'pt-BR')];

      const result = getVoiceURI(language, voices);

      expect(result).toBe('v-br');
    });

    it('should return the first Portuguese voice of the list for pt-TL', () => {
      const language = 'pt-TL';
      const voices = [
        makeVoice('v-en', 'en-US'),
        makeVoice('v-br', 'pt_BR'),
        makeVoice('v-pt', 'pt-PT')
      ];

      const result = getVoiceURI(language, voices);

      expect(result).toBe('v-br');
    });
  });

  describe('when the inputs are invalid', () => {
    it('should throw TypeError when voices is an object instead of a list', () => {
      const language = 'en';
      const voices = { voiceURI: 'v-en', name: 'v-en', lang: 'en-US' };

      const act = () => getVoiceURI(language, voices);

      expect(act).toThrow(TypeError);
    });

    it('should throw TypeError when voices is null', () => {
      const language = 'en';
      const voices = null;

      const act = () => getVoiceURI(language, voices);

      expect(act).toThrow(TypeError);
    });

    it('should throw TypeError when the only voice has no lang', () => {
      const language = 'en';
      const voices = [{ voiceURI: 'v-en', name: 'v-en' }];

      const act = () => getVoiceURI(language, voices);

      expect(act).toThrow(TypeError);
    });

    it('should throw TypeError when a voice without lang comes after a compatible voice', () => {
      const language = 'en';
      const voices = [
        makeVoice('v-en', 'en-US'),
        { voiceURI: 'v-x', name: 'v-x' }
      ];

      const act = () => getVoiceURI(language, voices);

      expect(act).toThrow(TypeError);
    });

    it('should throw TypeError when language is a number and the list is not empty', () => {
      const language = 123;
      const voices = [makeVoice('v-en', 'en-US')];

      const act = () => getVoiceURI(language, voices);

      expect(act).toThrow(TypeError);
    });

    it('should throw TypeError when language is undefined and the list is not empty', () => {
      const language = undefined;
      const voices = [makeVoice('v-en', 'en-US')];

      const act = () => getVoiceURI(language, voices);

      expect(act).toThrow(TypeError);
    });
  });
});
