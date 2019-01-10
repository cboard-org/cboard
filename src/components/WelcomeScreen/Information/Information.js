import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';

import messages from './Information.messages';

const Information = () => (
  <Fragment>
    <Typography align="center" className="WelcomeScreen__heading" variant="h2">
      <FormattedMessage {...messages.heading} />
    </Typography>
    <p>
      <FormattedMessage {...messages.text} />
    </p>
  </Fragment>
);

export default Information;
