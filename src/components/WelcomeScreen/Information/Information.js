import React, { Fragment } from 'react';
import Typography from 'material-ui/Typography';

const Information = () => (
  <Fragment>
    <Typography type="display3" className="WelcomeScreen__heading">
      Welcome to Cboard!
    </Typography>
    <div>
      <p>
        Cboard is an augmentative and alternative communication (AAC) web
        application, allowing users with speech and language impairments to
        communicate by symbols and text-to-speech.
      </p>
      <p>
        Cboard is a web application for children and adults with speech and
        language impairment, aiding communication with pictures and
        text-to-speech.
      </p>
      <p>
        You don't need an account to use Cboard, but if you sign up, your data
        will be shared between the devices you log in.
      </p>
    </div>
  </Fragment>
);

export default Information;
