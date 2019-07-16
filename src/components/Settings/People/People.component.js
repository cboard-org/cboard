import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';

import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './People.messages';
import { UserIcon } from '../../UI/UserIcon/UserIcon.component';

const propTypes = {
  /**
   * Callback fired when clicking the back button
   */
  onClose: PropTypes.func,
  isLogged: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

const handleChange = name => event => {
};


const People = ({
  onClose,
  isLogged,
  logout,
  user
}) => {
  return (
    <div className="People">
      <FullScreenDialog
        open
        title={<FormattedMessage {...messages.people} />}
        onClose={onClose}
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
                  value={user.name}
                  onChange={handleChange('name')}
                  margin="normal"
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
                  value={user.email}
                  onChange={handleChange('email')}
                  margin="normal"
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText
                primary={<FormattedMessage {...messages.language} />}
                secondary={<FormattedMessage {...messages.languageSecondary} />}
              />
              <ListItemSecondaryAction>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText
                primary={<FormattedMessage {...messages.birthdate} />}
                secondary={<FormattedMessage {...messages.birthdateSecondary} />}
              />
              <ListItemSecondaryAction>
                <TextField
                  id="user-date"
                  label={<FormattedMessage {...messages.birthdate} />}
                  type="date"
                  value={user.birthdate}
                  defaultValue="2017-05-24"
                  InputLabelProps={{
                    shrink: true,
                  }}
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

export default People;
