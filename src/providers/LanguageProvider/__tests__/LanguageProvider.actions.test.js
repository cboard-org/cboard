import * as actions from '../LanguageProvider.actions';
import * as types from '../LanguageProvider.constants';

describe('actions', () => {
  it('should create an action to change language', () => {
    const lang = 'en';
    const expectedAction = {
      type: types.CHANGE_LANG,
      lang
    };
    expect(actions.changeLang(lang)).toEqual(expectedAction);
  });

  it('should create an action to set languages', () => {
    const langs = ['en', 'he'];
    const expectedAction = {
      type: types.SET_LANGS,
      langs
    };
    expect(actions.setLangs(langs)).toEqual(expectedAction);
  });
});
