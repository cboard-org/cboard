import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';

import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './People.messages';

const propTypes = {
  /**
   * Callback fired when clicking the back button
   */
  onRequestClose: PropTypes.func
};

const People = ({ onRequestClose }) => (
  <div className="People">
    <FullScreenDialog
      open
      title={<FormattedMessage {...messages.people} />}
      onRequestClose={onRequestClose}
    >
      <Paper>
        <Button>Sign In</Button>
      </Paper>
    </FullScreenDialog>
  </div>
);

People.propTypes = propTypes;

export default People;
