import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Formik } from 'formik';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { TextField } from '../../UI/FormItems';
import LoadingIcon from '../../UI/LoadingIcon';
import validationSchema from './validationSchema';
import { login } from './Login.actions';
import messages from './Login.messages';
import './Login.css';
import PasswordTextField from '../../UI/FormItems/PasswordTextField';

export function Login({
  intl,
  isDialogOpen,
  onClose,
  onResetPasswordClick,
  dialogWithKeyboardStyle = {},
  login
}) {
  const [isLogging, setIsLogging] = useState(false);
  const [loginStatus, setLoginStatus] = useState({});

  useEffect(
    () => {
      if (isDialogOpen) {
        setLoginStatus({});
        setIsLogging(false);
      }
    },
    [isDialogOpen]
  );

  const handleSubmit = async values => {
    setIsLogging(true);
    setLoginStatus({});
    try {
      await login(values);
    } catch (loginStatus) {
      setLoginStatus(loginStatus);
      setIsLogging(false);
    }
  };

  const isButtonDisabled = isLogging || !!loginStatus.success;

  const { dialogStyle, dialogContentStyle } = dialogWithKeyboardStyle;

  return (
    <Dialog
      open={isDialogOpen}
      onClose={onClose}
      aria-labelledby="login"
      style={dialogStyle}
    >
      <DialogTitle id="login">
        <FormattedMessage {...messages.login} />
      </DialogTitle>
      <DialogContent style={dialogContentStyle}>
        <div
          className={classNames('Login__status', {
            'Login__status--error': !loginStatus.success,
            'Login__status--success': loginStatus.success
          })}
        >
          <Typography color="inherit">{loginStatus.message}</Typography>
        </div>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ values, errors, handleChange, handleSubmit }) => (
            <form className="Login__form" onSubmit={handleSubmit}>
              <TextField
                error={errors.email}
                label={intl.formatMessage(messages.email)}
                name="email"
                value={values.email}
                onChange={handleChange}
              />
              <PasswordTextField
                error={errors.password}
                label={intl.formatMessage(messages.password)}
                name="password"
                value={values.password}
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
                  {isLogging && <LoadingIcon />}
                  <FormattedMessage {...messages.login} />
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
        <Button
          size="small"
          color="primary"
          disabled={isButtonDisabled}
          onClick={onResetPasswordClick}
        >
          <FormattedMessage {...messages.forgotPassword} />
        </Button>
      </DialogContent>
    </Dialog>
  );
}

const mapDispatchToProps = {
  login
};

export default connect(
  null,
  mapDispatchToProps
)(injectIntl(Login));
