import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './Information.messages';

const Information = () => (
  <Fragment>
    <h2 align="center" className="WelcomeScreen__heading">
      <FormattedMessage {...messages.heading} />
    </h2 >
    <p>
      <FormattedMessage {...messages.text} />
    </p>
  </Fragment>
);

export default Information;
