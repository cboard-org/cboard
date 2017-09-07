import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Typography from 'material-ui/Typography';
import messages from './messages';
import FullScreenDialog, {
  FullScreenDialogContent
} from '../../components/FullScreenDialog';

import './About.css';

class About extends Component {
  render() {
    const { open, onRequestClose } = this.props;
    return (
      <FullScreenDialog
        open={open}
        title={<FormattedMessage {...messages.about} />}
        onRequestClose={onRequestClose}
      >
        <FullScreenDialogContent>
          <Typography type="body1">
            <FormattedMessage {...messages.intro} />
          </Typography>

          <Typography type="headline">
            <FormattedMessage {...messages.contributors} />
          </Typography>
          <Typography type="body1" headlineMapping={{ body1: 'div' }}>
            <ul>
              <li>
                <a href="https://twitter.com/amberleyjohanna">Amberley Romo</a>
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

          <Typography type="headline">
            <FormattedMessage {...messages.license} />
          </Typography>
          <Typography type="body1" headlineMapping={{ body1: 'div' }}>
            <ul>
              <li>
                Code -{' '}
                <a href="https://github.com/shayc/cboard/blob/master/LICENSE">
                  GPLv3
                </a>
              </li>
              <li>
                Symbols -{' '}
                <a href="https://creativecommons.org/licenses/by-sa/2.0/uk/">
                  CC BY-SA
                </a>
              </li>
            </ul>
          </Typography>
        </FullScreenDialogContent>
      </FullScreenDialog>
    );
  }
}

About.propTypes = {
  open: PropTypes.bool,
  onRequestClose: PropTypes.func
};

export default About;
