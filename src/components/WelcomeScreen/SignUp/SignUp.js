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
import { Radio, RadioGroup, Select, TextField } from '../../FormItems';
import validationSchema from './validationSchema';
import './SignUp.css';

class SignUp extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    errors: PropTypes.object.isRequired,
    handleBack: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    langs: PropTypes.array.isRequired,
    values: PropTypes.object.isRequired
  };

  render() {
    const {
      errors,
      handleBack,
      handleChange,
      handleSubmit,
      langs,
      values,
      intl
    } = this.props;

    return (
      <Dialog
        open
        onClose={handleBack}
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
              error={errors.email}
              label={intl.formatMessage(messages.email)}
              name="email"
              onChange={handleChange}
            />
            <TextField
              error={errors.age}
              label={intl.formatMessage(messages.age)}
              type="number"
              name="age"
              onChange={handleChange}
            />
            <Select
              error={errors.language}
              label={intl.formatMessage(messages.language)}
              name="language"
              onChange={handleChange}
              options={langs}
              value={values.language}
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
            <RadioGroup
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
            </RadioGroup>
            <DialogActions>
              <Button color="primary" onClick={handleBack}>
                <FormattedMessage {...messages.cancel} />
              </Button>
              <Button raised color="primary" type="submit">
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
  mapPropsToValues: () => ({ gender: 'female', language: '' }),
  handleSubmit: (values, { props }) => props.handleSubmit(values)
})(injectIntl(SignUp));
