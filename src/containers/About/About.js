import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import messages from './messages';
import FullScreenDialog from '../../components/FullScreenDialog';

import './About.css';

class About extends Component {
  render() {
    const { open, onCancel } = this.props;
    return (
      <FullScreenDialog
        open={open}
        title={<FormattedMessage {...messages.about} />}
        onCancel={onCancel}
      >
        <p>
          <FormattedMessage {...messages.intro} />
        </p>

        <h2>
          <FormattedMessage {...messages.contributors} />
        </h2>
        <ul>
          <li>Akshat</li>
          <li><a href="https://twitter.com/amberleyjohanna">Amberley Romo</a></li>
          <li><a href="https://twitter.com/hwk73">Arijit Bhattacharya</a></li>
          <li>Brandan Moore</li>
          <li><a href="https://twitter.com/jvuillermet">Jeremy Vuillermet</a></li>
          <li>Martin Bedouret</li>
          <li>Shay Cojocaru</li>
        </ul>

        <h2>
          <FormattedMessage {...messages.license} />
        </h2>
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
      </FullScreenDialog>
    );
  }
}

About.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func
};

export default About;
