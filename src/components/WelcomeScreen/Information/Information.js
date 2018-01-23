import React, { Fragment } from 'react';
import Typography from 'material-ui/Typography';

const Information = () => (
  <Fragment>
    <Typography
      align="center"
      className="WelcomeScreen__heading"
      type="display3"
    >
      Welcome to Cboard
    </Typography>
    <p>
      Cboard is an augmentative and alternative communication (AAC) application,
      allowing users with speech and language impairments to communicate with
      symbols and text-to-speech.
    </p>
  </Fragment>
);

export default Information;
