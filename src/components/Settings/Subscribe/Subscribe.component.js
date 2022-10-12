import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Subscribe.messages';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import '../Settings.css';

const propTypes = {
  /**
   * Callback fired when clicking the back button
   */
  onClose: PropTypes.func,
  /**
   * Callback fired when clicking the subscribe button
   */
  subscribe: PropTypes.func.isRequired,
  /**
   * flag for user
   */
  isLogged: PropTypes.bool.isRequired,
  /**
   * Name of user
   */
  name: PropTypes.string.isRequired,
  /**
   * User email
   */
  email: PropTypes.string.isRequired
};

const defaultProps = {
  name: '',
  email: '',
  location: { country: null, countryCode: null }
};

const Subscribe = ({
  onClose,
  isLogged,
  subscribe,
  name,
  email,
  location: { country, countryCode },
  onSubmitPeople
}) => {
  return (
    <div className="Subscribe">
      <FullScreenDialog
        open
        title={<FormattedMessage {...messages.subscribe} />}
        onClose={onClose}
      >
        <Paper>
          <List>
            <ListItem>
              <div className="Settings__Subscribe__Container">
                <MonetizationOnIcon />
              </div>
              <ListItemText primary={name} />
              <ListItemSecondaryAction className="Settings--secondaryAction">
                <Button variant="outlined" color="primary" onClick={subscribe}>
                  <FormattedMessage {...messages.subscribe} />
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>
      </FullScreenDialog>
    </div>
  );
};

Subscribe.propTypes = propTypes;
Subscribe.defaultProps = defaultProps;

export default Subscribe;
