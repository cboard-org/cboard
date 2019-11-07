import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Formik } from 'formik';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

import { TextField } from '../../UI/FormItems';
import LoadingIcon from '../../UI/LoadingIcon';
import validationSchema from './validationSchema';
import { storePassword } from './ChangePassword.actions';
import messages from './ChangePassword.messages';
import './ChangePassword.css';

export class ChangePassword extends Component {
  static propTypes = {
    intl: intlShape.isRequired
  };

  state = {
    isSending: false,
    storePasswordState: {},
    redirectMessage: ''
  };

  sleep = milliseconds => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  };

  handleSubmit = values => {
    const {
      match: {
        params: { userid, url }
      }
    } = this.props;

    const { intl, history, storePassword } = this.props;

    this.setState({
      isSending: true,
      storePasswordState: {}
    });

    storePassword(userid, values.password, url)
      .then(res => {
        this.setState({
          storePasswordState: res,
          redirectMessage: intl.formatMessage(messages.redirect)
        });
        this.sleep(2000).then(() => {
          history.replace('/login-signup');
        });
      })
      .catch(err => this.setState({ storePasswordState: err }))
      .finally(() => this.setState({ isSending: false }));
  };

  render() {
    const { isSending, storePasswordState, redirectMessage } = this.state;
    const { intl } = this.props;

    const isButtonDisabled = isSending || !!storePasswordState.success;

    return (
      <div className="ChangePassword">
        <Dialog open={true} aria-labelledby="changePassword">
          <DialogTitle id="changePassword">
            <FormattedMessage {...messages.changePassword} />
          </DialogTitle>
          <DialogContent>
            {storePasswordState && !storePasswordState.success && (
              <DialogContentText>
                <FormattedMessage {...messages.changePasswordText} />
              </DialogContentText>
            )}
            <div
              className={classNames('ChangePassword__status', {
                'ChangePassword__status--error': !storePasswordState.success,
                'ChangePassword__status--success': storePasswordState.success
              })}
            >
              {!!storePasswordState.success ? (
                <Typography color="inherit">
                  {intl.formatMessage(messages.changePasswordSuccess)}
                </Typography>
              ) : (
                <Typography color="inherit">
                  {storePasswordState.message}
                </Typography>
              )}
            </div>
            {redirectMessage && (
              <div
                className={classNames(
                  'ChangePassword__status',
                  'ChangePassword__status--success'
                )}
              >
                <Typography color="inherit">
                  {intl.formatMessage(messages.redirect)}
                </Typography>
              </div>
            )}
            {storePasswordState && !storePasswordState.success && (
              <Formik
                onSubmit={this.handleSubmit}
                validationSchema={validationSchema}
              >
                {({ errors, handleChange, handleSubmit }) => (
                  <form
                    className="ChangePassword__form"
                    onSubmit={handleSubmit}
                  >
                    <TextField
                      error={errors.password}
                      label={intl.formatMessage(messages.password)}
                      type="password"
                      name="password"
                      onChange={handleChange}
                    />
                    <TextField
                      error={errors.passwordRepeat}
                      label={intl.formatMessage(messages.passwordRepeat)}
                      type="password"
                      name="passwordRepeat"
                      onChange={handleChange}
                    />
                    <DialogActions>
                      <Button
                        type="submit"
                        disabled={isButtonDisabled}
                        variant="contained"
                        color="primary"
                      >
                        {isSending && <LoadingIcon />}
                        <FormattedMessage {...messages.send} />
                      </Button>
                    </DialogActions>
                  </form>
                )}
              </Formik>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

const mapDispatchToProps = {
  storePassword
};

export default connect(
  null,
  mapDispatchToProps
)(injectIntl(ChangePassword));
