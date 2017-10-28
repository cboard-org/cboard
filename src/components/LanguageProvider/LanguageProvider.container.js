import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

import { changeLang, setLangs } from './LanguageProvider.actions';
import { importTranslation } from '../../i18n';
import { APP_LANGS, DEFAULT_LANG } from '../App/App.constants';

export class LanguageProvider extends Component {
  static propTypes = {
    lang: PropTypes.string.isRequired,
    hostLangs: PropTypes.array,
    children: PropTypes.node.isRequired
  };

  static defaultProps = {
    hostLangs: []
  };

  state = {
    messages: null
  };

  initLang() {
    const { hostLangs, setLangs, changeLang } = this.props;
    const supportedLangs = hostLangs.filter(hostLang =>
      APP_LANGS.includes(hostLang)
    );

    const userLang = supportedLangs.includes(window.navigator.language)
      ? window.navigator.language
      : DEFAULT_LANG;

    setLangs(supportedLangs);
    changeLang(userLang);
  }

  componentDidMount() {
    const { lang } = this.props;

    if (lang) {
      this.fetchMessages(lang);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { lang } = nextProps;

    // todo once
    this.initLang();

    if (lang) {
      this.fetchMessages(lang);
    }
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
  hostLangs: state.speech.langs
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
