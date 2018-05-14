import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './People.messages';

const propTypes = {
  /**
   * Callback fired when clicking the back button
   */
  onClose: PropTypes.func
};

const People = ({ onClose }) => (
  <div className="People">
    <FullScreenDialog
      open
      title={<FormattedMessage {...messages.people} />}
      onClose={onClose}
    >
      <Paper>
        <Button>Sign In</Button>
      </Paper>
    </FullScreenDialog>
  </div>
);

People.propTypes = propTypes;

export default People;
