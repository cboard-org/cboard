import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Grid, Box, Typography } from '@material-ui/core';
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
  location: { country },
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
          <Box px={2} py={2}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={4}
            >
              <UserIcon />
              <Box display="flex" justifyContent="center" width="100%">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={logout}
                  component={Link}
                  to="/"
                >
                  <FormattedMessage {...messages.logout} />
                </Button>
              </Box>
            </Box>

            <Grid container spacing={2} alignItems="center" mb={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                  <FormattedMessage {...messages.name} />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage {...messages.nameSecondary} />
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  disabled={!isLogged}
                  id="user-name"
                  label={<FormattedMessage {...messages.name} />}
                  value={name}
                  onChange={onChangePeople('name')}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center" mb={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">
                  <FormattedMessage {...messages.email} />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage {...messages.emailSecondary} />
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  disabled
                  label={<FormattedMessage {...messages.email} />}
                  value={email}
                  onChange={onChangePeople('email')}
                />
              </Grid>
            </Grid>

            {country && (
              <Grid container spacing={2} alignItems="center" mb={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">
                    <FormattedMessage {...messages.location} />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    disabled
                    label={<FormattedMessage {...messages.location} />}
                    value={country}
                  />
                </Grid>
              </Grid>
            )}

            {isLogged && (
              <Grid container spacing={2} alignItems="center" mt={5}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">
                    <FormattedMessage {...messages.deleteAccountPrimary} />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <FormattedMessage {...messages.deleteAccountSecondary} />
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    display="flex"
                    justifyContent={{ xs: 'center', sm: 'flex-end' }}
                  >
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<DeleteIcon />}
                      onClick={() => setOpenDeleteConfirmation(true)}
                    >
                      <FormattedMessage {...messages.deleteAccountPrimary} />
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Box>
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
