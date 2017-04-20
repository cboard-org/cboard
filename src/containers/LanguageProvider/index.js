/*
 *
 * LanguageProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `app/translations`)
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';

import { stripRegionCode } from '../../i18n';

export class LanguageProvider extends PureComponent {
  constructor(props) {
    super(props);

    const { language } = props;
    this.state = { language };
  }

  onLanguageToggle = (event, index, value) => {
    this.setState({ language: value });
  }

  render() {
    const lang = stripRegionCode(this.state.language);
    const messages = this.props.messages[lang];

    return (
      <IntlProvider locale={lang} messages={messages}>
        {React.cloneElement(this.props.children, {
          messages: { messages },
          onLanguageToggle: this.onLanguageToggle,
          language: this.state.language
        })}
      </IntlProvider>
    );
  }
}

LanguageProvider.propTypes = {
  language: PropTypes.string,
  messages: PropTypes.object,
  children: PropTypes.element.isRequired,
};

export default LanguageProvider;
