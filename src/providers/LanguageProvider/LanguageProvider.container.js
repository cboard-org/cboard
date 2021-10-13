import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

import { DEFAULT_LANG } from '../../components/App/App.constants';
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

  componentDidMount() {
    const { lang } = this.props;

    if (lang) {
      this.fetchMessages(lang);
    } else {
      this.fetchMessages(DEFAULT_LANG);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { lang } = nextProps;

    if (lang) {
      this.fetchMessages(lang);
    }
  }

  fetchMessages(lang) {
    const {
      platformLangs,
      changeLang,
      setLangs,
      showNotification
    } = this.props;
    this.setState({ messages: null });

    importTranslation(lang)
      .then(messages => {
        this.setState({ messages });
      })
      .catch(() => {
        if (!platformLangs.includes(DEFAULT_LANG)) {
          setLangs(platformLangs.push(DEFAULT_LANG));
        }
        changeLang(DEFAULT_LANG);
        showNotification(`A ${lang} translation was not found!.
          Go to Settings if you want to change language.`);
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
  changeLang,
  setLangs,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageProvider);
