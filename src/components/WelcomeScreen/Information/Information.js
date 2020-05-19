import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './Information.messages';

const Information = ({heading, text}) => (
  <Fragment>
    <h2 align="center" className="WelcomeScreen__heading">
      {heading ? heading : (<FormattedMessage {...messages.heading} />)}
    </h2>
    <p>
      {text ? text : (<FormattedMessage {...messages.text} />)}
    </p>
  </Fragment>
);

export default Information;
