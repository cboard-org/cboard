import languageProviderReducer from '../LanguageProvider.reducer';
import getLang from '../LanguageProvider.reducer';
import { CHANGE_LANG, SET_LANGS } from '../LanguageProvider.constants';
import { LOGIN_SUCCESS } from '../../../components/Account/Login/Login.constants';
import { DEFAULT_LANG } from '../../../components/App/App.constants';
let initialState, languageGetter;;

describe('reducer', () => {
  beforeEach(() => {
    initialState = {
      lang: DEFAULT_LANG,
      dir: 'ltr',
      langs: [],
      localLangs: [],
      langsFetched: false,
      downloadingLang: {
        isdownloading: false
      }
    };
    mockLanguage = {
      lang: '',
      dir: '',
      langs: []
    };
  });

  it('should return the initial state', () => {
    expect(languageProviderReducer(undefined, {})).toEqual(initialState);
  });
  it('should handle login ', () => {
    const login = {
      type: LOGIN_SUCCESS,
      payload: initialState
    };
    expect(languageProviderReducer(initialState, login)).toEqual({
      ...initialState,
      dir: 'ltr'
    });
  });
  it('should handle setLangs ', () => {
    const setLangs = {
      type: SET_LANGS,
      langs: ['de-DE', 'en-GB', 'en-US']
    };
    expect(languageProviderReducer(initialState, setLangs)).toEqual({
      ...initialState,
      langsFetched: true,
      langs: ['de-DE', 'en-GB', 'en-US']
    });
  });

  it('should handle changeLang ', () => {
    const changeLang = {
      type: CHANGE_LANG,
      lang: 'de-DE'
    };
    expect(languageProviderReducer(initialState, changeLang)).toEqual({
      ...initialState,
      lang: 'de-DE',
      dir: 'ltr'
    });
  });




});



describe('reducer', () => {
  beforeEach(() => {
    // Mock the browser language
    languageGetter = jest.spyOn (window.navigator, 'language', 'get');
    
    initialState = {
      lang: DEFAULT_LANG,
      dir: 'ltr',
      langs: [],
      localLangs: [],
      langsFetched: false,
      downloadingLang: {
        isdownloading: false
      }
    };
  });

  it('should return the default language', () => {
    languageGetter.mockReturnValue('jp');

    expect(navigator.language).toEqual('jp');

    expect(getLang()).toEqual('jp-JP');
  });

  it('should return the default language', () => {
    languageGetter.mockReturnValue('en-US');
    expect(getLang()).toEqual('en-US');
  });

  it('should return the default language', () => {
    languageGetter.mockReturnValue('de');
    expect(languageProviderReducer(undefined, {})).toEqual({
      ...initialState,
      lang: 'de-DE',
      dir: 'ltr'
    })
  });

  it ('integrated with other func', () => {
    languageGetter.mockReturnValue('zh');
    expect(languageProviderReducer(undefined, {})).toEqual({
      ...initialState,
      lang: 'zh-CN',
      dir: 'ltr'
    })
  });
});