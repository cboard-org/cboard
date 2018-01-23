import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import Button from 'material-ui/Button';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogActions
} from 'material-ui/Dialog';
import { Radio, RadioGroup, Select, TextField } from '../../FormItems';

import validationSchema from './validationSchema';
import './SignUp.css';

class SignUp extends Component {
  static propTypes = {
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
      values
    } = this.props;

    return (
      <Dialog
        open
        onClose={handleBack}
        aria-labelledby="welcome-screen-sign-up"
      >
        <DialogTitle id="welcome-screen-sign-up">Sign Up</DialogTitle>
        <DialogContent>
          <form className="SignUp__form" onSubmit={handleSubmit}>
            <TextField
              error={errors.name}
              label="Name"
              name="name"
              onChange={handleChange}
            />
            <TextField
              error={errors.email}
              label="Email"
              name="email"
              onChange={handleChange}
            />
            <TextField
              error={errors.age}
              label="Age"
              type="number"
              name="age"
              onChange={handleChange}
            />
            <Select
              error={errors.language}
              label="Language"
              name="language"
              onChange={handleChange}
              options={langs}
              value={values.language}
            />
            <TextField
              error={errors.password}
              label="Create your password"
              type="password"
              name="password"
              onChange={handleChange}
            />
            <TextField
              error={errors.passwordConfirm}
              label="Confirm your password"
              type="password"
              name="passwordConfirm"
              onChange={handleChange}
            />
            <RadioGroup
              error={errors.gender}
              label="Gender"
              name="gender"
              onChange={handleChange}
              value={values.gender}
            >
              <Radio value="female" label="Female" />
              <Radio value="male" label="Male" />
            </RadioGroup>
            <DialogActions>
              <Button color="primary" onClick={handleBack}>
                Cancel
              </Button>
              <Button raised color="primary" type="submit">
                Sign me up
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
})(SignUp);
