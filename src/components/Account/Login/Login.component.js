import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { withFormik } from 'formik';
import classNames from 'classnames';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogActions
} from 'material-ui/Dialog';

import { TextField } from '../../UI/FormItems';
import LoadingIcon from '../../UI/LoadingIcon';
import validationSchema from './validationSchema';
import messages from './Login.messages';
import './Login.css';

class Login extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    errors: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    isDialogOpen: PropTypes.bool.isRequired,
    isLogging: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  render() {
    const {
      intl,
      loginStatus,
      errors,
      handleChange,
      handleSubmit,
      isDialogOpen,
      isLogging,
      onClose
    } = this.props;

    return (
      <Dialog open={isDialogOpen} onClose={onClose} aria-labelledby="login">
        <DialogTitle id="login">
          <FormattedMessage {...messages.login} />
        </DialogTitle>
        <DialogContent>
          <div
            className={classNames('Login__status', {
              'Login__status--error': !loginStatus.success,
              'Login__status--success': loginStatus.success
            })}
          >
            <Typography color="inherit">{loginStatus.message}</Typography>
          </div>
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
              <Button color="primary" disabled={isLogging} onClick={onClose}>
                <FormattedMessage {...messages.cancel} />
              </Button>
              <Button
                type="submit"
                disabled={isLogging}
                variant="raised"
                color="primary"
              >
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
