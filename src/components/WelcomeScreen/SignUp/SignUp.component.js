import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { withFormik } from 'formik';
import Button from 'material-ui/Button';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogActions
} from 'material-ui/Dialog';

import messages from './SignUp.messages';
import { /* Radio, RadioGroup, */ Select, TextField } from '../../FormItems';
import LoadingIcon from '../../LoadingIcon';
import validationSchema from './validationSchema';
import './SignUp.css';

class SignUp extends Component {
  static propTypes = {
    errors: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    isSigningUp: PropTypes.bool.isRequired,
    langs: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired
  };

  render() {
    const {
      errors,
      handleChange,
      handleSubmit,
      isDialogOpen,
      isSigningUp,
      langs,
      onClose,
      values,
      intl
    } = this.props;

    return (
      <Dialog
        open={isDialogOpen}
        onClose={onClose}
        aria-labelledby="welcome-screen-sign-up"
      >
        <DialogTitle id="welcome-screen-sign-up">
          <FormattedMessage {...messages.signUp} />
        </DialogTitle>
        <DialogContent>
          <form className="SignUp__form" onSubmit={handleSubmit}>
            <TextField
              error={errors.name}
              label={intl.formatMessage(messages.name)}
              name="name"
              onChange={handleChange}
            />
            <TextField
              error={errors.username}
              label="Username"
              name="username"
              onChange={handleChange}
            />
            <TextField
              error={errors.email}
              label={intl.formatMessage(messages.email)}
              name="email"
              onChange={handleChange}
            />
            {/* <TextField
              error={errors.age}
              label={intl.formatMessage(messages.age)}
              type="number"
              name="age"
              onChange={handleChange}
            /> */}
            <Select
              error={errors.locale}
              label={intl.formatMessage(messages.language)}
              name="locale"
              onChange={handleChange}
              options={langs}
              value={values.locale}
            />
            <TextField
              error={errors.password}
              label={intl.formatMessage(messages.createYourPassword)}
              type="password"
              name="password"
              onChange={handleChange}
            />
            <TextField
              error={errors.passwordConfirm}
              label={intl.formatMessage(messages.confirmYourPassword)}
              type="password"
              name="passwordConfirm"
              onChange={handleChange}
            />
            {/* <RadioGroup
              error={errors.gender}
              label={intl.formatMessage(messages.gender)}
              name="gender"
              onChange={handleChange}
              value={values.gender}
            >
              <Radio
                value="female"
                label={intl.formatMessage(messages.female)}
              />
              <Radio value="male" label={intl.formatMessage(messages.male)} />
            </RadioGroup> */}
            <DialogActions>
              <Button color="primary" disabled={isSigningUp} onClick={onClose}>
                <FormattedMessage {...messages.cancel} />
              </Button>
              <Button
                disabled={isSigningUp}
                variant="raised"
                color="primary"
                type="submit"
              >
                {isSigningUp && <LoadingIcon />}
                <FormattedMessage {...messages.signMeUp} />
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withFormik({
  validationSchema,
  mapPropsToValues: () => ({ locale: '' }),
  handleSubmit: (values, { props }) => props.handleSubmit(values)
})(injectIntl(SignUp));
