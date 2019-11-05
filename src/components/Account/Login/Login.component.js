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

export class Login extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    isDialogOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onResetPasswordClick: PropTypes.func.isRequired
  };

  state = {
    isLogging: false,
    loginStatus: {}
  };

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

  render() {
    const { isLogging, loginStatus } = this.state;
    const { intl, isDialogOpen, onClose, onResetPasswordClick } = this.props;

    const isButtonDisabled = isLogging || !!loginStatus.success;

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
