import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import speech from '../../speech';
import { changeLocale } from '../LanguageProvider/LanguageProvider.actions';

export class SpeechProvider extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
  };

  componentWillMount() {
    this.setDefaultLocale();
  }

  setDefaultLocale() {
    const { locale, changeLocale } = this.props;

    speech.getLocales().then(speechLocales => {
      if (!locale) {
        const navigatorLocale = navigator.languages[0].slice(0, 2);
        let defaultLocale = speechLocales.includes(navigatorLocale)
          ? navigatorLocale
          : 'en';

        changeLocale(defaultLocale);
      }
    });
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

const mapStateToProps = state => {
  return {
    locale: state.language.locale
  };
};

const mapDispatchToProps = dispatch => ({
  changeLocale: locale => {
    dispatch(changeLocale(locale));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SpeechProvider);
