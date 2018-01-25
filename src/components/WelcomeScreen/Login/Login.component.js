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

import messages from './Login.messages';
import { TextField } from '../../FormItems';
import LoadingIcon from '../../LoadingIcon';
import validationSchema from './validationSchema';
import './Login.css';

class Login extends Component {
  static propTypes = {
    errors: PropTypes.object.isRequired,
    handleBack: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    isLogging: PropTypes.bool.isRequired
  };

  render() {
    const {
      errors,
      handleBack,
      handleChange,
      handleSubmit,
      intl,
      isLogging
    } = this.props;

    return (
      <Dialog open onClose={handleBack} aria-labelledby="welcome-screen-login">
        <DialogTitle id="welcome-screen-login">Login</DialogTitle>
        <DialogContent>
          <form className="Login__form" onSubmit={handleSubmit}>
            <TextField
              error={errors.email}
              label={intl.formatMessage(messages.email)}
              name="email"
              onChange={handleChange}
            />
            <TextField
              error={errors.password}
              label={intl.formatMessage(messages.password)}
              type="password"
              name="password"
              onChange={handleChange}
            />
            <DialogActions>
              <Button color="primary" disabled={isLogging} onClick={handleBack}>
                <FormattedMessage {...messages.cancel} />
              </Button>
              <Button disabled={isLogging} raised color="primary" type="submit">
                {isLogging && <LoadingIcon />}
                <FormattedMessage {...messages.login} />
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
})(injectIntl(Login));
