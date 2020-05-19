import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import WelcomeScreen from '../WelcomeScreen';
import messages from './AuthScreen.messages';
import './AuthScreen.css';

class AuthScreen extends Component {
  static propTypes = {
    intl: intlShape.isRequired
  };

  render() {
    const { history, intl } = this.props;

    return (
      <div className="AuthScreen__content">
        <WelcomeScreen
          heading={intl.formatMessage(messages.heading)}
          text={intl.formatMessage(messages.text)}
          onClose={history.goBack}
        />
      </div>
    );
  }
}

export default injectIntl(AuthScreen);
