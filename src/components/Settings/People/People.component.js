import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import TextField from '@material-ui/core/TextField';

import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './People.messages';
import UserIcon from '../../UI/UserIcon';
import DeleteIcon from '@material-ui/icons/Delete';
import '../Settings.css';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

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
  email: PropTypes.string.isRequired,
  /**
   * User birthdate
   */
  birthdate: PropTypes.string.isRequired,
  onDeleteAccount: PropTypes.func
};

const defaultProps = {
  name: '',
  email: '',
  birthdate: '',
  location: { country: null, countryCode: null }
};

const People = ({
  onClose,
  isLogged,
  logout,
  name,
  email,
  birthdate,
  location: { country, countryCode },
  onChangePeople,
  onSubmitPeople,
  onDeleteAccount
}) => {
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [errorDeletingAccount, setErrorDeletingAccount] = useState(false);

  const handleCloseDeleteDialog = () => {
    setOpenDeleteConfirmation(false);
  };

  const handleDeleteConfirmed = async () => {
    setIsDeletingAccount(true);
    setErrorDeletingAccount(false);
    try {
      await onDeleteAccount();
      setIsDeletingAccount(false);
    } catch (error) {
      console.error(error);
      setIsDeletingAccount(false);
      setErrorDeletingAccount(true);
    }
  };

  return (
    <div className="People">
      <FullScreenDialog
        open
        title={<FormattedMessage {...messages.people} />}
        onClose={onClose}
        onSubmit={onSubmitPeople}
        disableSubmit={!isLogged}
      >
        <Paper>
          <List>
            <ListItem>
              <div className="Settings__UserIcon__Container">
                <UserIcon />
              </div>
              <ListItemText primary={name} />
              <ListItemSecondaryAction className="Settings--secondaryAction">
                <Button
                  disabled={!isLogged}
                  variant="outlined"
                  color="primary"
                  onClick={logout}
                  component={Link}
                  to="/"
                >
                  <FormattedMessage {...messages.logout} />
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText
                primary={<FormattedMessage {...messages.name} />}
                secondary={<FormattedMessage {...messages.nameSecondary} />}
              />
              <ListItemSecondaryAction className="Settings--secondaryAction">
                <TextField
                  disabled={!isLogged}
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
              <ListItemSecondaryAction className="Settings--secondaryAction">
                <TextField
                  className="Settings--secondaryAction--textField"
                  disabled={true} // Replace with `{!isLogged}` untill fix issue #140 on cboard-api
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
                secondary={
                  <FormattedMessage {...messages.birthdateSecondary} />
                }
              />
              <ListItemSecondaryAction className="Settings--secondaryAction">
                <TextField
                  className="Settings--secondaryAction--textField"
                  disabled={!isLogged}
                  id="user-birthdate"
                  label={<FormattedMessage {...messages.birthdate} />}
                  type="date"
                  value={birthdate}
                  InputLabelProps={{
                    shrink: true
                  }}
                  onChange={onChangePeople('birthdate')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            {country && (
              <ListItem>
                <ListItemText
                  primary={<FormattedMessage {...messages.location} />}
                />
                <ListItemSecondaryAction className="Settings--secondaryAction">
                  <TextField
                    className="Settings--secondaryAction--textField"
                    disabled={true}
                    id="user-location"
                    label={<FormattedMessage {...messages.location} />}
                    value={country}
                    margin="normal"
                    country-code={countryCode}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            )}
            {isLogged && (
              <ListItem>
                <ListItemText
                  primary={
                    <FormattedMessage {...messages.deleteAccountPrimary} />
                  }
                  secondary={
                    <FormattedMessage {...messages.deleteAccountSecondary} />
                  }
                  className={'list_item_left'}
                />
                <ListItemSecondaryAction className="Settings--secondaryAction">
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    className={'delete_button'}
                    onClick={() => {
                      setOpenDeleteConfirmation(true);
                    }}
                  >
                    <FormattedMessage {...messages.deleteAccountPrimary} />
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            )}
          </List>
        </Paper>
        <DeleteConfirmationDialog
          open={openDeleteConfirmation}
          handleClose={handleCloseDeleteDialog}
          handleDeleteConfirmed={handleDeleteConfirmed}
          isDeletingAccount={isDeletingAccount}
          errorDeletingAccount={errorDeletingAccount}
        />
      </FullScreenDialog>
    </div>
  );
};

People.propTypes = propTypes;
People.defaultProps = defaultProps;

export default People;
