import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { withFormik } from 'formik';
import classNames from 'classnames';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogActions
} from 'material-ui/Dialog';

import { TextField } from '../../UI/FormItems';
import LoadingIcon from '../../UI/LoadingIcon';
import validationSchema from './validationSchema';
import messages from './SignUp.messages';
import './SignUp.css';

class SignUp extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    errors: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    isSigningUp: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  render() {
    const {
      signUpStatus,
      errors,
      handleChange,
      handleSubmit,
      isDialogOpen,
      isSigningUp,
      onClose,
      intl
    } = this.props;

    return (
      <Dialog open={isDialogOpen} onClose={onClose} aria-labelledby="sign-up">
        <DialogTitle id="sign-up">
          <FormattedMessage {...messages.signUp} />
        </DialogTitle>
        <DialogContent>
          <div
            className={classNames('SignUp__status', {
              'SignUp__status--error': !signUpStatus.success,
              'SignUp__status--success': signUpStatus.success
            })}
          >
            <Typography color="inherit">{signUpStatus.message}</Typography>
          </div>
          <form className="SignUp__form" onSubmit={handleSubmit}>
            <TextField
              name="name"
              label={intl.formatMessage(messages.name)}
              error={errors.name}
              onChange={handleChange}
            />
            <TextField
              name="email"
              label={intl.formatMessage(messages.email)}
              error={errors.email}
              onChange={handleChange}
            />
            <TextField
              type="password"
              name="password"
              label={intl.formatMessage(messages.createYourPassword)}
              error={errors.password}
              onChange={handleChange}
            />
            <TextField
              type="password"
              name="passwordConfirm"
              label={intl.formatMessage(messages.confirmYourPassword)}
              error={errors.passwordConfirm}
              onChange={handleChange}
            />

            <DialogActions>
              <Button color="primary" disabled={isSigningUp} onClick={onClose}>
                <FormattedMessage {...messages.cancel} />
              </Button>
              <Button
                type="submit"
                disabled={isSigningUp}
                variant="raised"
                color="primary"
              >
                {isSigningUp && <LoadingIcon />}
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
  handleSubmit: (values, { props }) => props.handleSubmit(values)
})(injectIntl(SignUp));
