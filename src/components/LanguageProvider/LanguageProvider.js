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
    platformLangs: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      messages: null
    };
  }

  initLang() {
    const { platformLangs, changeLang } = this.props;
    let lang = platformLangs.includes(window.navigator.language)
      ? window.navigator.language
      : 'en';

    changeLang(lang);
  }

  componentWillMount() {
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

  fetchMessages(lang) {
    this.setState({ messages: null });

    importTranslation(lang).then(messages => {
      this.setState({ messages });
    });
  }

  render() {
    const { lang, children } = this.props;
    const lang = lang.slice(0, 2);

    if (!this.state.local || !this.state.messages) {
      return null;
    }

    return (
      <IntlProvider lang={lang} key={lang} messages={this.state.messages}>
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
