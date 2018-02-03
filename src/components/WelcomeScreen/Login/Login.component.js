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
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    isLogging: PropTypes.bool.isRequired
  };

  render() {
    const {
      errors,
      handleChange,
      handleSubmit,
      history,
      intl,
      isLogging
    } = this.props;

    return (
      <Dialog
        open
        onClose={history.goBack}
        aria-labelledby="welcome-screen-login"
      >
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
              <Button
                color="primary"
                disabled={isLogging}
                onClick={history.goBack}
              >
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
