import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import FullScreenDialog from '../../components/FullScreenDialog';
import messages from './messages';

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

        <h2>Contributors</h2>
        <ul>
          <li>Shay</li>
          <li>Akshat</li>
          <li>Amberley</li>
        </ul>

        <h2>License</h2>
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
  className: PropTypes.string
};

About.defaultProps = {};

export default About;
