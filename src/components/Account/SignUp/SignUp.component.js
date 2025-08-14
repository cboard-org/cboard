import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Formik, ErrorMessage } from 'formik';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { TextField } from '../../UI/FormItems';
import LoadingIcon from '../../UI/LoadingIcon';
import validationSchema from './validationSchema';
import { signUp } from './SignUp.actions';
import messages from './SignUp.messages';
import './SignUp.css';
import PasswordTextField from '../../UI/FormItems/PasswordTextField';

function SignUp(props) {
  const { intl, isDialogOpen, onClose, dialogWithKeyboardStyle = {} } = props;

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signUpStatus, setSignUpStatus] = useState({});

  const isButtonDisabled = isSigningUp || !!signUpStatus.success;

  useEffect(
    () => {
      if (isDialogOpen) {
        setSignUpStatus({});
      }
    },
    [isDialogOpen]
  );

  async function handleSubmit(values) {
    const { passwordConfirm, ...formValues } = values;

    setIsSigningUp(true);
    setSignUpStatus({});

    try {
      const res = await signUp(formValues);
      setSignUpStatus(res);
    } catch (err) {
      const responseMessage = err?.response?.data?.message;
      const message = responseMessage
        ? responseMessage
        : intl.formatMessage(messages.noConnection);
      setSignUpStatus({ success: false, message });
    } finally {
      setIsSigningUp(false);
    }
  }

  const { dialogStyle, dialogContentStyle } = dialogWithKeyboardStyle ?? {};
  const values = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    isTermsAccepted: false
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={onClose}
      aria-labelledby="sign-up"
      style={dialogStyle}
    >
      <DialogTitle id="sign-up">
        <FormattedMessage {...messages.signUp} />
      </DialogTitle>
      <DialogContent style={dialogContentStyle}>
        <div
          className={classNames('SignUp__status', {
            'SignUp__status--error': !signUpStatus.success,
            'SignUp__status--success': signUpStatus.success
          })}
        >
          <Typography color="inherit">{signUpStatus.message}</Typography>
        </div>
        {signUpStatus && !signUpStatus.success && (
          <Formik
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            initialValues={values}
          >
            {({ errors, handleChange, handleSubmit }) => (
              <form className="SignUp__form" onSubmit={handleSubmit}>
                <TextField
                  name="name"
                  label={intl.formatMessage(messages.name)}
                  error={errors.name}
                  onChange={handleChange}
                />
                <TextField
                  name="email"
                  label={intl.formatMessage(messages.email)}
                  error={errors.email}
                  onChange={handleChange}
                />
                <PasswordTextField
                  error={errors.password}
                  label={intl.formatMessage(messages.createYourPassword)}
                  name="password"
                  onChange={handleChange}
                />
                <PasswordTextField
                  error={errors.passwordConfirm}
                  label={intl.formatMessage(messages.confirmYourPassword)}
                  name="passwordConfirm"
                  onChange={handleChange}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      type="checkbox"
                      name="isTermsAccepted"
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label={
                    <FormattedMessage
                      {...messages.agreement}
                      values={{
                        terms: (
                          <a
                            href="https://www.cboard.io/terms-of-use/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {intl.formatMessage(messages.termsAndConditions)}
                          </a>
                        ),
                        privacy: (
                          <a
                            href="https://www.cboard.io/privacy/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {intl.formatMessage(messages.privacy)}
                          </a>
                        )
                      }}
                    />
                  }
                />
                <ErrorMessage
                  name="isTermsAccepted"
                  component="p"
                  className="SignUp__status--error SignUp__termsError"
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
                    {isSigningUp && <LoadingIcon />}
                    <FormattedMessage {...messages.signMeUp} />
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

SignUp.propTypes = {
  intl: intlShape.isRequired,
  isDialogOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  dialogWithKeyboardStyle: PropTypes.object
};

export { SignUp };  
export default injectIntl(SignUp);
