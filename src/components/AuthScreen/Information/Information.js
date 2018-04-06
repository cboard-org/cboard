import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from 'material-ui/Typography';

import messages from './Information.messages';

const Information = () => (
  <Fragment>
    <Typography
      className="AuthScreen__heading"
      align="center"
      variant="display3"
    >
      <FormattedMessage {...messages.heading} />
    </Typography>
    <Typography className="AuthScreen__heading" align="center" variant="body1">
      <FormattedMessage {...messages.text} />
    </Typography>
  </Fragment>
);

export default Information;
