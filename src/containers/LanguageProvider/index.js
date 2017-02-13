/*
 *
 * LanguageProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `app/translations`)
 */

import React from 'react';
import { IntlProvider } from 'react-intl';

export class LanguageProvider extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    const {locale} = props;
    this.state = { locale: locale };
  }

  onLanguageToggle = (event) => {
    const locale = event.target.value;
    this.setState({ locale });
  }

  render() {
    return (
      <IntlProvider locale={this.state.locale} key={this.state.locale} messages={this.props.messages[this.state.locale]}>
        {React.cloneElement(this.props.children, { onLanguageToggle: this.onLanguageToggle, locale: this.state.locale })}
      </IntlProvider>
    );
  }
}

LanguageProvider.propTypes = {
  locale: React.PropTypes.string,
  messages: React.PropTypes.object,
  children: React.PropTypes.element.isRequired,
};

export default LanguageProvider;
