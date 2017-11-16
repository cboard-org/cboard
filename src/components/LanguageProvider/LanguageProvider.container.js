import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

import { APP_LANGS, DEFAULT_LANG } from '../App/App.constants';
import { changeLang, setLangs } from './LanguageProvider.actions';
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
    const { platformLangs } = this.props;
    const supportedLangs = this.getSupportedLangs(platformLangs);
    const defaultLang = this.getDefaultLang(platformLangs);

    setLangs(supportedLangs);
    changeLang(defaultLang);
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
    return langs.includes(window.navigator.language)
      ? window.navigator.language
      : DEFAULT_LANG;
  }

  fetchMessages(lang) {
    this.setState({ messages: null });

    importTranslation(lang).then(messages => {
      this.setState({ messages });
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

const mapDispatchToProps = dispatch => ({
  setLangs: langs => {
    dispatch(setLangs(langs));
  },
  changeLang: lang => {
    dispatch(changeLang(lang));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageProvider);
