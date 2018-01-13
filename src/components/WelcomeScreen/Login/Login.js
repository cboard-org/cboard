import React, { Component } from 'react';
import { withFormik } from 'formik';

import Button from 'material-ui/Button';
import Dialog, { DialogContent } from 'material-ui/Dialog';
import { TextField } from '../../FormItems';

import validationSchema from './validationSchema';
import './Login.css';

class Login extends Component {
  render() {
    const { errors, handleBack, handleChange, handleSubmit } = this.props;

    return (
      <Dialog open onClose={handleBack}>
        <DialogContent>
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
            <div className="Login__buttons">
              <Button raised color="primary" type="submit">
                Login
              </Button>
              <Button raised onClick={handleBack}>
                Back
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withFormik({
  validationSchema,
  handleSubmit: (values, { props }) => props.handleSubmit(values)
})(Login);
