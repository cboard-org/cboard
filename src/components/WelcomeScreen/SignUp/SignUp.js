import React, { Component } from 'react';
import { withFormik } from 'formik';

import Button from 'material-ui/Button';
import { Radio, RadioGroup, TextField } from '../../FormItems';

import validationSchema from './validationSchema';
import './SignUp.css';

class SignUp extends Component {
  render() {
    const {
      errors,
      handleBack,
      handleChange,
      handleSubmit,
      values
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <TextField
          error={errors.name}
          label="Name"
          name="name"
          onChange={handleChange}
        />
        <TextField
          error={errors.email}
          label="E-mail"
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
        <RadioGroup
          className="SignUp__field_gender"
          error={errors.gender}
          label="Gender"
          name="gender"
          onChange={handleChange}
          value={values.gender}
        >
          <Radio value="female" label="Female" />
          <Radio value="male" label="Male" />
        </RadioGroup>
        <div>
          <Button
            raised
            color="primary"
            type="submit"
            className="SignUp__button"
          >
            Sign me up
          </Button>
          <Button raised onClick={handleBack}>
            Back
          </Button>
        </div>
      </form>
    );
  }
}

export default withFormik({
  validationSchema,
  mapPropsToValues: () => ({ gender: 'female' }),
  handleSubmit: (values, { props }) => props.handleSubmit(values)
})(SignUp);
