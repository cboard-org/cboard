import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { changeLang } from '../../LanguageProvider/LanguageProvider.actions';
import Language from './Language.component';
import messages from './Language.messages';

const sortLangs = (lang, [...langs] = []) => {
  const langIndex = langs.indexOf(lang);
  if (langIndex >= 0) {
    const temp = langs[0];
    langs[0] = langs[langIndex];
    langs[langIndex] = temp;
  }
  return langs;
};

export class LanguageContainer extends Component {
  static propTypes = {
    /**
     * Active language
     */
    lang: PropTypes.string.isRequired,
    /**
     * Language list
     */
    langs: PropTypes.arrayOf(PropTypes.string).isRequired,
    /**
     * If true, LanguageContainer will be visible
     */
    open: PropTypes.bool,

    /**
     * Callback fired when language changes
     */
    onLangChange: PropTypes.func,
    /**
     * Callback fired when clicking the back button
     */
    onRequestClose: PropTypes.func
  };

  state = { selectedLang: this.props.lang };

  reset() {
    const { lang } = this.props;
    this.setState({ selectedLang: lang });
  }

  handleCancel = () => {
    const { onRequestClose } = this.props;
    this.reset();
    onRequestClose();
  };

  handleSubmit = () => {
    const { onLangChange } = this.props;
    onLangChange(this.state.selectedLang);
  };

  handleLangClick = lang => {
    this.setState({ selectedLang: lang });
  };

  render() {
    const { open, lang, langs } = this.props;
    const { selectedLang } = this.state;
    const sortedLangs = sortLangs(lang, langs);

    return (
      <Language
        open={open}
        title={<FormattedMessage {...messages.language} />}
        selectedLang={selectedLang}
        langs={sortedLangs}
        onLangClick={this.handleLangClick}
        onRequestClose={this.handleCancel}
        onSubmitLang={this.handleSubmit}
      />
    );
  }
}

const mapStateToProps = state => ({
  lang: state.language.lang,
  langs: state.language.langs
});

const mapDispatchToProps = dispatch => ({
  onLangChange: lang => {
    dispatch(changeLang(lang));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageContainer);
