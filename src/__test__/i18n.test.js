import * as i18n from '../i18n';
describe('i18n', () => {
  it('should import translation data', () => {
    i18n.importTranslation('es-ES').then(lang => {
      expect(lang.cboard.components.WelcomeScreen.login).toBe('Iniciar sesión');
    });
  });
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
