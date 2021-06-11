import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';

import messages from './About.messages';
import FullScreenDialog, {
  FullScreenDialogContent
} from '../../UI/FullScreenDialog';

import './About.css';

About.propTypes = {
  history: PropTypes.object.isRequired,
  onClose: PropTypes.func
};

function About({ history, onClose }) {
  return (
    <FullScreenDialog
      open
      title={<FormattedMessage {...messages.about} />}
      onClose={history.goBack}
    >
      <Paper>
        <FullScreenDialogContent>
          <Typography variant="body1">
            <FormattedMessage {...messages.intro} />
          </Typography>

          <Typography variant="h5">
            <FormattedMessage {...messages.contributors} />
          </Typography>
          <Typography variant="body1" component="div">
            <ul>
              <li>
                <Link
                  href="https://twitter.com/amberleyjohanna"
                  target="_blank"
                >
                  Amberley Romo
                </Link>
              </li>
              <li>
                <Link href="https://twitter.com/_arthurdenner" target="_blank">
                  Arthur Denner
                </Link>
              </li>
              <li>
                <Link href="https://twitter.com/hwk73" target="_blank">
                  Arijit Bhattacharya
                </Link>
              </li>
              <li>
                <Link href="https://github.com/BrendanFDMoore" target="_blank">
                  Brendan Moore
                </Link>
              </li>
              <li>
                <Link href="https://twitter.com/jvuillermet" target="_blank">
                  Jeremy Vuillermet
                </Link>
              </li>
              <li>
                <Link href="https://twitter.com/jquintozamora" target="_blank">
                  Jose Quinto
                </Link>
              </li>
              <li>
                <Link href="https://github.com/martinbedouret" target="_blank">
                  Martin Bedouret
                </Link>
              </li>
              <li>
                <Link href="https://github.com/shayc" target="_blank">
                  Shay Cojocaru
                </Link>
              </li>
            </ul>
          </Typography>
          <Typography variant="h5">
            <FormattedMessage {...messages.resources} />
          </Typography>
          <Typography variant="body1" component="div">
            <ul>
              <li>
                <Link
                  href="https://openassistive.org/awesome-assistivetech/"
                  target="_blank"
                >
                  Awesome Assistivetech
                </Link>{' '}
                - A curated list of{' '}
                <span role="img" aria-label="cool">
                  😎
                </span>{' '}
                awesome Assistive Technology frameworks and tools to help you
                develop your AT tool/system.
              </li>
            </ul>
          </Typography>
          <Typography variant="h5">
            <FormattedMessage {...messages.license} />
          </Typography>
          <Typography variant="body1" component="div">
            <ul>
              <li>
                Code -{' '}
                <Link
                  href="https://github.com/shayc/cboard/blob/master/LICENSE"
                  target="_blank"
                >
                  GPLv3
                </Link>
              </li>
              <li>
                Mulberry Symbols -{' '}
                <Link
                  href="https://creativecommons.org/licenses/by-sa/2.0/uk/"
                  target="_blank"
                >
                  CC BY-SA
                </Link>
              </li>
            </ul>
          </Typography>
        </FullScreenDialogContent>
      </Paper>
    </FullScreenDialog>
  );
}

export default About;
