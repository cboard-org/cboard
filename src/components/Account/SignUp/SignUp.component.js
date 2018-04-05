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

import messages from './SignUp.messages';
import { TextField } from '../../UI/FormItems';
import LoadingIcon from '../../UI/LoadingIcon';
import validationSchema from './validationSchema';
import './SignUp.css';

class SignUp extends Component {
  static propTypes = {
    errors: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    isSigningUp: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired
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
              error={errors.name}
              label={intl.formatMessage(messages.name)}
              name="name"
              onChange={handleChange}
            />
            <TextField
              error={errors.email}
              label={intl.formatMessage(messages.email)}
              name="email"
              onChange={handleChange}
            />
            <TextField
              error={errors.password}
              label={intl.formatMessage(messages.createYourPassword)}
              type="password"
              name="password"
              onChange={handleChange}
            />
            <TextField
              error={errors.passwordConfirm}
              label={intl.formatMessage(messages.confirmYourPassword)}
              type="password"
              name="passwordConfirm"
              onChange={handleChange}
            />

            <DialogActions>
              <Button color="primary" disabled={isSigningUp} onClick={onClose}>
                <FormattedMessage {...messages.cancel} />
              </Button>
              <Button
                disabled={isSigningUp}
                variant="raised"
                color="primary"
                type="submit"
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
  mapPropsToValues: () => ({ locale: '' }),
  handleSubmit: (values, { props }) => props.handleSubmit(values)
})(injectIntl(SignUp));
