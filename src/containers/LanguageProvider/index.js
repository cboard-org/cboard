/*
 *
 * LanguageProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `app/translations`)
 */

import React from 'react';
import { IntlProvider } from 'react-intl';

import { stripRegionCode } from '../../i18n';

export class LanguageProvider extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    const {language} = props;
    this.state = { language };
  }

  onLanguageToggle = (event) => {
    const language = event.target.value;
    this.setState({ language });
  }

  render() {
    const lang = stripRegionCode(this.state.language);
    return (
      <IntlProvider locale={this.state.language} messages={this.props.messages[lang]}>
        {React.cloneElement(this.props.children, { onLanguageToggle: this.onLanguageToggle, language: this.state.language })}
      </IntlProvider>
    );
  }
}

LanguageProvider.propTypes = {
  language: React.PropTypes.string,
  messages: React.PropTypes.object,
  children: React.PropTypes.element.isRequired,
};

export default LanguageProvider;
