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
import MenuItem from '@material-ui/core/MenuItem';
import { TextField } from '../../UI/FormItems';
import LoadingIcon from '../../UI/LoadingIcon';
import {
  validationSchemaStep1,
  validationSchemaStep2
} from './validationSchema';
import { signUp } from './SignUp.actions';
import messages from './SignUp.messages';
import './SignUp.css';
import PasswordTextField from '../../UI/FormItems/PasswordTextField';

function SignUp(props) {
  const { intl, isDialogOpen, onClose, dialogWithKeyboardStyle = {} } = props;

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signUpStatus, setSignUpStatus] = useState({});
  const [step, setStep] = useState(1);

  const isButtonDisabled = isSigningUp || !!signUpStatus.success;

  useEffect(
    () => {
      if (isDialogOpen) {
        setSignUpStatus({});
        setStep(1);
      }
    },
    [isDialogOpen]
  );

  async function handleSubmit(values, formikActions) {
    if (step === 1) {
      setStep(2);
      formikActions.setTouched({});
      formikActions.setSubmitting(false);
      return;
    }

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
      formikActions.setSubmitting(false);
    }
  }

  const { dialogStyle, dialogContentStyle } = dialogWithKeyboardStyle ?? {};
  const initialValues = {
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    isTermsAccepted: false,
    role: '',
    age: '',
    pathology: []
  };

  const currentValidationSchema =
    step === 1 ? validationSchemaStep1 : validationSchemaStep2;

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
            validationSchema={currentValidationSchema}
            initialValues={initialValues}
          >
            {({ errors, handleChange, handleSubmit, values }) => (
              <form className="SignUp__form" onSubmit={handleSubmit}>
                {step === 1 && (
                  <>
                    <TextField
                      fullWidth
                      name="name"
                      label={intl.formatMessage(messages.name)}
                      error={errors.name}
                      value={values.name}
                      onChange={handleChange}
                    />
                    <TextField
                      fullWidth
                      name="email"
                      label={intl.formatMessage(messages.email)}
                      error={errors.email}
                      value={values.email}
                      onChange={handleChange}
                    />
                    <PasswordTextField
                      fullWidth
                      error={errors.password}
                      label={intl.formatMessage(messages.createYourPassword)}
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                    />
                    <PasswordTextField
                      fullWidth
                      error={errors.passwordConfirm}
                      label={intl.formatMessage(messages.confirmYourPassword)}
                      name="passwordConfirm"
                      value={values.passwordConfirm}
                      onChange={handleChange}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          type="checkbox"
                          name="isTermsAccepted"
                          onChange={handleChange}
                          checked={values.isTermsAccepted}
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
                                {intl.formatMessage(
                                  messages.termsAndConditions
                                )}
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
                  </>
                )}

                {step === 2 && (
                  <>
                    <TextField
                      fullWidth
                      select
                      SelectProps={{
                        MenuProps: {
                          getContentAnchorEl: null,
                          anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left'
                          }
                        }
                      }}
                      name="role"
                      label={intl.formatMessage(messages.role)}
                      value={values.role}
                      error={errors.role}
                      onChange={handleChange}
                    >
                      <MenuItem value="AAC User">
                        {intl.formatMessage(messages.roleAACUser)}
                      </MenuItem>
                      <MenuItem value="Educator / Teacher">
                        {intl.formatMessage(messages.roleEducator)}
                      </MenuItem>
                      <MenuItem value="Therapist / SLP">
                        {intl.formatMessage(messages.roleTherapist)}
                      </MenuItem>
                      <MenuItem value="Family Member / Caregiver">
                        {intl.formatMessage(messages.roleFamily)}
                      </MenuItem>
                    </TextField>

                    <TextField
                      fullWidth
                      type="number"
                      name="age"
                      label={intl.formatMessage(messages.age)}
                      value={values.age}
                      error={errors.age}
                      onChange={handleChange}
                    />

                    <TextField
                      fullWidth
                      select
                      SelectProps={{
                        multiple: true,
                        MenuProps: {
                          getContentAnchorEl: null,
                          anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left'
                          }
                        }
                      }}
                      name="pathology"
                      label={intl.formatMessage(messages.pathology)}
                      value={values.pathology}
                      error={errors.pathology}
                      onChange={handleChange}
                    >
                      <MenuItem value="Autism">
                        {intl.formatMessage(messages.pathologyAutism)}
                      </MenuItem>
                      <MenuItem value="Cerebral Palsy">
                        {intl.formatMessage(messages.pathologyCerebralPalsy)}
                      </MenuItem>
                      <MenuItem value="ALS">
                        {intl.formatMessage(messages.pathologyALS)}
                      </MenuItem>
                      <MenuItem value="Aphasia">
                        {intl.formatMessage(messages.pathologyAphasia)}
                      </MenuItem>
                      <MenuItem value="Down Syndrome">
                        {intl.formatMessage(messages.pathologyDownSyndrome)}
                      </MenuItem>
                      <MenuItem value="Other">
                        {intl.formatMessage(messages.pathologyOther)}
                      </MenuItem>
                      <MenuItem value="Prefer not to say">
                        {intl.formatMessage(messages.pathologyPreferNotToSay)}
                      </MenuItem>
                    </TextField>
                  </>
                )}

                <DialogActions>
                  {step === 1 && (
                    <Button
                      color="primary"
                      disabled={isButtonDisabled}
                      onClick={onClose}
                    >
                      <FormattedMessage {...messages.cancel} />
                    </Button>
                  )}
                  {step === 2 && (
                    <Button
                      color="primary"
                      disabled={isButtonDisabled}
                      onClick={() => setStep(1)}
                    >
                      <FormattedMessage {...messages.back} />
                    </Button>
                  )}
                  {step === 1 && (
                    <Button
                      type="submit"
                      disabled={isButtonDisabled}
                      variant="contained"
                      color="primary"
                    >
                      <FormattedMessage {...messages.next} />
                    </Button>
                  )}
                  {step === 2 && (
                    <Button
                      type="submit"
                      disabled={isButtonDisabled}
                      variant="contained"
                      color="primary"
                    >
                      {isSigningUp && <LoadingIcon />}
                      <FormattedMessage {...messages.completeSignUp} />
                    </Button>
                  )}
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

export default injectIntl(SignUp);
