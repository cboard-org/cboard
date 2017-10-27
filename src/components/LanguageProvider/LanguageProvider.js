import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

import { changeLang } from './LanguageProvider.actions';
import { importTranslation } from '../../i18n';
import { APP_LANGS } from '../App/App.constants';

export class LanguageProvider extends Component {
  static propTypes = {
    lang: PropTypes.string.isRequired,
    hostLangs: PropTypes.array,
    children: PropTypes.node.isRequired
  };

  static defaultProps = {
    hostLangs: []
  };

  constructor(props) {
    super(props);

    this.state = {
      messages: null
    };
  }

  initLang() {
    const { hostLangs, changeLang } = this.props;
    const langs = hostLangs.length
      ? hostLangs.filter(platformLang => APP_LANGS.includes(platformLang))
      : APP_LANGS;

    const lang = langs.includes(window.navigator.language)
      ? window.navigator.language
      : 'en';
    changeLang(lang);
  }

  componentWillMount() {
    const { lang } = this.props;
    this.initLang();

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
  lang: state.language.lang
});

const mapDispatchToProps = dispatch => ({
  changeLang: lang => {
    dispatch(changeLang(lang));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageProvider);
