import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';

import Button from 'material-ui/Button';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogActions
} from 'material-ui/Dialog';
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
      <Dialog open onClose={handleBack} aria-labelledby="welcome-screen-login">
        <DialogTitle id="welcome-screen-login">Login</DialogTitle>
        <DialogContent>
          <form className="Login__form" onSubmit={handleSubmit}>
            <TextField
              error={errors.email}
              label="Email"
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
            <DialogActions>
              <Button color="primary" onClick={handleBack}>
                Cancel
              </Button>
              <Button raised color="primary" type="submit">
                Login
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
  handleSubmit: (values, { props }) => props.handleSubmit(values)
})(Login);
