import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Formik } from 'formik';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { TextField } from '../../UI/FormItems';
import LoadingIcon from '../../UI/LoadingIcon';
import validationSchema from './validationSchema';
import { forgot } from './ResetPassword.actions';
import messages from './ResetPassword.messages';
import './ResetPassword.css';

export function ResetPassword({ intl, isDialogOpen, onClose }) {
  const [isSending, setIsSending] = useState(false);
  const [forgotState, setForgotState] = useState({});
  const isButtonDisabled = isSending || !!forgotState.success;

  function handleSubmit(values) {
    setIsSending(true);
    setForgotState({});

    forgot(values)
      .then(response => setForgotState(response))
      .catch(error => setForgotState(error))
      .finally(() => setIsSending(false));
  }

  return (
    <Dialog open={isDialogOpen} onClose={onClose} aria-labelledby="forgot">
      <DialogTitle id="forgot">
        <FormattedMessage {...messages.resetPassword} />
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          <FormattedMessage {...messages.resetPasswordText} />
        </DialogContentText>

        <div
          className={classNames('Forgot__status', {
            'Forgot__status--error': !forgotState.success,
            'Forgot__status--success': forgotState.success
          })}
        >
          {!!forgotState.success ? (
            <Typography color="inherit">
              {intl.formatMessage(messages.resetPasswordSuccess)}
            </Typography>
          ) : (
            <Typography color="inherit">{forgotState.message}</Typography>
          )}
        </div>

        {forgotState && !forgotState.success && (
          <Formik
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            initialValues={{
              email: ''
            }}
          >
            {({ errors, handleChange, handleSubmit }) => (
              <form className="Forgot__form" onSubmit={handleSubmit}>
                <TextField
                  error={errors.email}
                  label={intl.formatMessage(messages.email)}
                  name="email"
                  onChange={handleChange}
                />

                <DialogActions>
                  <Button
                    color="primary"
                    disabled={isButtonDisabled}
                    onClick={onClose}
                  >
                    <FormattedMessage {...messages.cancel} />
                  </Button>

                  <Button
                    type="submit"
                    disabled={isButtonDisabled}
                    variant="contained"
                    color="primary"
                  >
                    {isSending && <LoadingIcon />}
                    <FormattedMessage {...messages.send} />
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        )}
      </DialogContent>
    </Dialog>
  );
}

ResetPassword.propTypes = {
  intl: intlShape.isRequired,
  forgot: PropTypes.func.isRequired,
  isDialogOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  forgot
};

export default connect(
  null,
  mapDispatchToProps
)(injectIntl(ResetPassword));
