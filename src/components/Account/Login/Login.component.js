import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Formik } from 'formik';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { TextField } from '../../UI/FormItems';
import LoadingIcon from '../../UI/LoadingIcon';
import validationSchema from './validationSchema';
import { login } from './Login.actions';
import messages from './Login.messages';
import './Login.css';
import PasswordTextField from '../../UI/FormItems/PasswordTextField';

export class Login extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    isDialogOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onResetPasswordClick: PropTypes.func.isRequired,
    dialogWithKeyboardStyle: PropTypes.object
  };

  static defaultProps = {
    dialogWithKeyboardStyle: {}
  };

  state = {
    isLogging: false,
    loginStatus: {},
    isPasswordVisible: false
  };

  componentDidUpdate({ isDialogOpen }) {
    if (this.props.isDialogOpen && this.props.isDialogOpen !== isDialogOpen) {
      this.setState({ loginStatus: {} });
    }
  }

  handleSubmit = values => {
    const { login } = this.props;

    this.setState({
      isLogging: true,
      loginStatus: {}
    });

    login(values)
      .catch(loginStatus => this.setState({ loginStatus }))
      .finally(() => this.setState({ isLogging: false }));
  };
  togglePasswordVisibility = () => {
    this.setState(prevState => ({
      isPasswordVisible: !prevState.isPasswordVisible
    }));
  };

  render() {
    const { isLogging, loginStatus, isPasswordVisible } = this.state;
    const {
      intl,
      isDialogOpen,
      onClose,
      onResetPasswordClick,
      dialogWithKeyboardStyle
    } = this.props;
    const { dialogStyle, dialogContentStyle } = dialogWithKeyboardStyle ?? {};

    const isButtonDisabled = isLogging || !!loginStatus.success;

    return (
      <Dialog
        open={isDialogOpen}
        onClose={onClose}
        aria-labelledby="login"
        style={dialogStyle}
      >
        <DialogTitle id="login">
          <FormattedMessage {...messages.login} />
        </DialogTitle>
        <DialogContent style={dialogContentStyle}>
          <div
            className={classNames('Login__status', {
              'Login__status--error': !loginStatus.success,
              'Login__status--success': loginStatus.success
            })}
          >
            <Typography color="inherit">{loginStatus.message}</Typography>
          </div>
          <Formik
            onSubmit={this.handleSubmit}
            validationSchema={validationSchema}
          >
            {({ errors, handleChange, handleSubmit }) => (
              <form className="Login__form" onSubmit={handleSubmit}>
                <TextField
                  error={errors.email}
                  label={intl.formatMessage(messages.email)}
                  name="email"
                  onChange={handleChange}
                />
                <PasswordTextField
                  error={errors.password}
                  label={intl.formatMessage(messages.password)}
                  type={isPasswordVisible ? 'text' : 'password'}
                  name="password"
                  onChange={handleChange}
                />
                <DialogActions>
                  <Button
                    color="primary"
                    disabled={isButtonDisabled}
                    onClick={onClose}
                  >
                    <FormattedMessage {...messages.cancel} />
                  </Button>
                  <Button
                    type="submit"
                    disabled={isButtonDisabled}
                    variant="contained"
                    color="primary"
                  >
                    {isLogging && <LoadingIcon />}
                    <FormattedMessage {...messages.login} />
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
          <Button
            size="small"
            color="primary"
            disabled={isButtonDisabled}
            onClick={onResetPasswordClick}
          >
            <FormattedMessage {...messages.forgotPassword} />
          </Button>
        </DialogContent>
      </Dialog>
    );
  }
}

const mapDispatchToProps = {
  login
};

export default connect(
  null,
  mapDispatchToProps
)(injectIntl(Login));
