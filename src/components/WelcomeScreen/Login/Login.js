import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import Button from 'material-ui/Button';
import Dialog, { DialogContent } from 'material-ui/Dialog';
import { TextField } from '../../FormItems';

import validationSchema from './validationSchema';
import './Login.css';

class Login extends Component {
  static propTypes = {
    errors: PropTypes.object.isRequired,
    handleBack: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired
  };

  render() {
    const { errors, handleBack, handleChange, handleSubmit } = this.props;

    return (
      <Dialog open onClose={handleBack}>
        <DialogContent>
          <form onSubmit={handleSubmit} className="Login__form">
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
