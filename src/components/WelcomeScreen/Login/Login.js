import React, { Component, Fragment } from 'react';
import { withFormik } from 'formik';

import Button from 'material-ui/Button';
import { TextField } from '../../FormItems';

import validationSchema from './validationSchema';
import './Login.css';

class Login extends Component {
  render() {
    const { errors, handleBack, handleChange, handleSubmit } = this.props;

    return (
      <Fragment>
        <form onSubmit={handleSubmit}>
          <TextField
            error={errors.email}
            label="E-mail"
            name="email"
            onChange={handleChange}
          />
          <TextField
            error={errors.password}
            label="Password"
            type="password"
            name="password"
            onChange={handleChange}
          />
          <div>
            <Button
              raised
              color="primary"
              type="submit"
              className="Login__button"
            >
              Login
            </Button>
            <Button raised onClick={handleBack}>
              Back
            </Button>
          </div>
        </form>
      </Fragment>
    );
  }
}

export default withFormik({
  validationSchema,
  mapPropsToValues: () => ({ gender: 'female' }),
  handleSubmit: (values, { props }) => props.handleSubmit(values)
})(Login);
