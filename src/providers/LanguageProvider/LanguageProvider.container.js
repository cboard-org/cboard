import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

import { APP_LANGS, DEFAULT_LANG } from '../../components/App/App.constants';
import { changeLang, setLangs } from './LanguageProvider.actions';
import { showNotification } from '../../components/Notifications/Notifications.actions';
import { importTranslation } from '../../i18n';

export class LanguageProvider extends Component {
  static propTypes = {
    /**
     * Active language
     */
    lang: PropTypes.string.isRequired,
    /**
     * Platform supported languages
     */
    platformLangs: PropTypes.array,
    children: PropTypes.node.isRequired
  };

  static defaultProps = {
    platformLangs: []
  };

  state = {
    messages: null
  };

  componentWillMount() {
    const { lang: propsLang, platformLangs, setLangs, changeLang } = this.props;
    const supportedLangs = this.getSupportedLangs(platformLangs);
    const lang = this.getDefaultLang(supportedLangs);

    setLangs(supportedLangs);
    changeLang(lang);
  }

  componentDidMount() {
    const { lang } = this.props;
    if (lang) {
      this.fetchMessages(lang);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { lang } = nextProps;
    if (lang) {
      this.fetchMessages(lang);
    }
  }

  getSupportedLangs(langs) {
    return langs.filter(lang => APP_LANGS.includes(lang));
  }

  getDefaultLang(langs) {
    let lang;
    for (let i = 0; i < langs.length; i++) {
      lang = langs[i];
      if (lang.length >= 2) lang = lang.slice(0, 2);
      else continue;
      if (lang === window.navigator.language && langs[i].length > 2)
        return langs[i];
    }

    return DEFAULT_LANG;

    // return langs.includes(window.navigator.language)
    //   ? window.navigator.language
    //   : DEFAULT_LANG;
  }

  fetchMessages(lang) {
    const { changeLang, showNotification } = this.props;

    this.setState({ messages: null });

    importTranslation(lang)
      .then(messages => {
        this.setState({ messages });
      })
      .catch(() => {
        changeLang(DEFAULT_LANG);
        showNotification(`A ${lang} translation was not found, so the language was set to English (en-US).
          Go to Settings if you want to change it.`);
      });
  }

  render() {
    const { lang, children } = this.props;
    const locale = lang.slice(0, 2);

    if (!this.state.messages) {
      return null;
    }

    return (
      <IntlProvider locale={locale} key={locale} messages={this.state.messages}>
        {React.Children.only(children)}
      </IntlProvider>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.language.lang,
  platformLangs: state.speech.langs
});

const mapDispatchToProps = {
  setLangs,
  changeLang,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageProvider);
