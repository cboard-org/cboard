import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import TextField from '@material-ui/core/TextField';

import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './People.messages';

const propTypes = {
  /**
   * Callback fired when clicking the back button
   */
  onClose: PropTypes.func,
  /**
 * Callback fired when clicking the logout button
 */
  logout: PropTypes.func.isRequired,
  /**
   * Name of user
   */
  name: PropTypes.string.isRequired,
  /**
   * User email
   */
  email: PropTypes.string.isRequired,
  /**
   * User birthdate
   */
  birthdate: PropTypes.string.isRequired
};

const defaultProps = {
  name: '',
  email: '',
  birthdate: ''
};

const People = ({
  onClose,
  logout,
  name,
  email,
  birthdate,
  onChangePeople,
  onSubmitPeople
}) => {
  return (
    <div className="People">
      <FullScreenDialog
        open
        title={<FormattedMessage {...messages.people} />}
        onClose={onClose}
        onSubmit={onSubmitPeople}
      >
        <Paper>
          <List>
            <ListItem>
              <ListItemText
                primary={<FormattedMessage {...messages.name} />}
                secondary={<FormattedMessage {...messages.nameSecondary} />}
              />
              <ListItemSecondaryAction>
                <TextField
                  id="user-name"
                  label={<FormattedMessage {...messages.name} />}
                  value={name}
                  margin="normal"
                  onChange={onChangePeople('name')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText
                primary={<FormattedMessage {...messages.email} />}
                secondary={<FormattedMessage {...messages.emailSecondary} />}
              />
              <ListItemSecondaryAction>
                <TextField
                  id="user-email"
                  label={<FormattedMessage {...messages.email} />}
                  value={email}
                  margin="normal"
                  onChange={onChangePeople('email')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText
                primary={<FormattedMessage {...messages.birthdate} />}
                secondary={<FormattedMessage {...messages.birthdateSecondary} />}
              />
              <ListItemSecondaryAction>
                <TextField
                  id="user-birthdate"
                  label={<FormattedMessage {...messages.birthdate} />}
                  type="date"
                  value={birthdate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={onChangePeople('birthdate')}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>
      </FullScreenDialog>
    </div>
  );
};

People.propTypes = propTypes;
People.defaultProps = defaultProps;

export default People;
