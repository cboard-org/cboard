import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import messages from './About.messages';
import FullScreenDialog, { FullScreenDialogContent } from '../FullScreenDialog';

import './About.css';

About.propTypes = {
  history: PropTypes.object.isRequired,
  onRequestClose: PropTypes.func
};

function About({ history, onRequestClose }) {
  return (
    <FullScreenDialog
      open
      title={<FormattedMessage {...messages.about} />}
      onRequestClose={history.goBack}
    >
      <Paper>
        <FullScreenDialogContent>
          <Typography variant="body1">
            <FormattedMessage {...messages.intro} />
          </Typography>

          <Typography variant="headline">
            <FormattedMessage {...messages.contributors} />
          </Typography>
          <Typography variant="body1" headlineMapping={{ body1: 'div' }}>
            <ul>
              <li>
                <a href="https://twitter.com/amberleyjohanna">Amberley Romo</a>
              </li>
              <li>
                <a href="https://twitter.com/_arthurdenner">Arthur Denner</a>
              </li>
              <li>
                <a href="https://twitter.com/hwk73">Arijit Bhattacharya</a>
              </li>
              <li>
                <a href="https://github.com/BrendanFDMoore">Brendan Moore</a>
              </li>
              <li>
                <a href="https://twitter.com/jvuillermet">Jeremy Vuillermet</a>
              </li>
              <li>
                <a href="https://twitter.com/jquintozamora">Jose Quinto</a>
              </li>
              <li>Martin Bedouret</li>
              <li>
                <a href="https://github.com/shayc">Shay Cojocaru</a>
              </li>
            </ul>
          </Typography>
          <Typography variant="headline">
            <FormattedMessage {...messages.resources} />
          </Typography>
          <Typography variant="body1" headlineMapping={{ body1: 'div' }}>
            <ul>
              <li>
                <a href="https://openassistive.org/awesome-assistivetech/">
                  Awesome Assistivetech
                </a>{' '}
                - A curated list of{' '}
                <span role="img" aria-label="cool">
                  😎
                </span>{' '}
                awesome Assistive Technology frameworks and tools to help you
                develop your AT tool/system.
              </li>
            </ul>
          </Typography>
          <Typography variant="headline">
            <FormattedMessage {...messages.license} />
          </Typography>
          <Typography variant="body1" headlineMapping={{ body1: 'div' }}>
            <ul>
              <li>
                Code -{' '}
                <a href="https://github.com/shayc/cboard/blob/master/LICENSE">
                  GPLv3
                </a>
              </li>
              <li>
                Mulberry Symbols -{' '}
                <a href="https://creativecommons.org/licenses/by-sa/2.0/uk/">
                  CC BY-SA
                </a>
              </li>
            </ul>
          </Typography>
        </FullScreenDialogContent>
      </Paper>
    </FullScreenDialog>
  );
}

export default About;
