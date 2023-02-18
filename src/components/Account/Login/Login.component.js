import React, { useState } from 'react';
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

function Login(props) {
  const { intl, isDialogOpen, onClose, onResetPasswordClick, login } = props;
  const [isLogin, setIsLogin] = useState(false);
  const [loginStatus, setLoginStatus] = useState({});

  const loginStatusClassName = classNames('Login__status', {
    'Login__status--error': !loginStatus.success,
    'Login__status--success': loginStatus.success
  });

  const isButtonDisabled = isLogin || !!loginStatus.success;

  function handleSubmit(values) {
    setIsLogin(true);
    setLoginStatus({});

    login(values)
      .catch(loginStatus => setLoginStatus(loginStatus))
      .finally(() => setIsLogin(false));
  }

  return (
    <Dialog open={isDialogOpen} onClose={onClose} aria-labelledby="login">
      <DialogTitle id="login">
        <FormattedMessage {...messages.login} />
      </DialogTitle>

      <DialogContent>
        <div className={loginStatusClassName}>
          <Typography color="inherit">{loginStatus.message}</Typography>
        </div>

        <Formik
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          initialValues={{
            email: '',
            password: ''
          }}
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
                  {isLogin && <LoadingIcon />}
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

Login.propTypes = {
  intl: intlShape.isRequired,
  isDialogOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onResetPasswordClick: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  login
};

export default connect(
  null,
  mapDispatchToProps
)(injectIntl(Login));
