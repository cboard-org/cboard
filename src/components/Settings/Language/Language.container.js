import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { changeLocaleAndVoice } from '../../App/App.actions';
import Language from './Language.component';
import messages from './Language.messages';

const sortLocales = (locale, [...locales] = []) => {
  const localeIndex = locales.indexOf(locale);
  if (localeIndex >= 0) {
    const temp = locales[0];
    locales[0] = locales[localeIndex];
    locales[localeIndex] = temp;
  }
  return locales;
};

export class LanguageContainer extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    locales: PropTypes.array.isRequired,
    open: PropTypes.bool,

    onLocaleChange: PropTypes.func,
    onRequestClose: PropTypes.func
  };

  constructor(props) {
    super(props);

    const { locale } = this.props;
    this.state = { selectedLocale: locale };
  }

  reset() {
    const { locale } = this.props;
    this.setState({ selectedLocale: locale });
  }

  handleCancel = () => {
    const { onRequestClose } = this.props;
    this.reset();
    onRequestClose();
  };

  handleSubmit = () => {
    const { onLocaleChange } = this.props;
    onLocaleChange(this.state.selectedLocale);
  };

  handleLocaleClick = locale => {
    this.setState({ selectedLocale: locale });
  };

  render() {
    const { open, locale, locales } = this.props;
    const { selectedLocale } = this.state;
    const sortedLocales = sortLocales(locale, locales);

    return (
      <Language
        open={open}
        title={<FormattedMessage {...messages.language} />}
        selectedLocale={selectedLocale}
        locales={sortedLocales}
        onLocaleClick={this.handleLocaleClick}
        onRequestClose={this.handleCancel}
        onSubmitLocale={this.handleSubmit}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    locale: state.language.locale,
    locales: state.language.locales
  };
};

export function mapDispatchToProps(dispatch) {
  return {
    onLocaleChange: locale => {
      dispatch(changeLocaleAndVoice(locale));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageContainer);
