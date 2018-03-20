import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

import messages from './LoginSignUpScreen.messages';
import { finishFirstVisit } from '../App/App.actions';
import Information from './Information';
import Login from '../Accounts/Login';
import SignUp from '../Accounts/SignUp';
import './LoginSignUpScreen.css';

class LoginSignUpScreen extends Component {
  state = {
    activeView: ''
  };

  static propTypes = {
    finishFirstVisit: PropTypes.func.isRequired
  };

  handleActiveView = activeView => {
    this.setState({
      activeView
    });
  };

  resetActiveView = () => {
    this.setState({
      activeView: ''
    });
  };

  render() {
    const { history } = this.props;
    const { activeView } = this.state;

    return (
      <Dialog fullScreen open onClose={history.goBack}>
        <div className="LoginSignUpScreen">
          <div className="LoginSignUpScreen__container">
            <IconButton
              color="inherit"
              onClick={history.goBack}
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
            <div className="LoginSignUpScreen__content">
              <Information />
            </div>
            <footer className="LoginSignUpScreen__footer">
              <Button
                className="LoginSignUpScreen__button LoginSignUpScreen__button--login"
                variant="raised"
                onClick={() => this.handleActiveView('login')}
              >
                <FormattedMessage {...messages.login} />
              </Button>
              <Button
                className="LoginSignUpScreen__button LoginSignUpScreen__button--signup"
                variant="raised"
                color="primary"
                onClick={() => this.handleActiveView('signup')}
              >
                <FormattedMessage {...messages.signUp} />
              </Button>
            </footer>
          </div>
          <Login
            isDialogOpen={activeView === 'login'}
            onClose={this.resetActiveView}
          />
          <SignUp
            isDialogOpen={activeView === 'signup'}
            onClose={this.resetActiveView}
          />
        </div>
      </Dialog>
    );
  }
}

const mapDispatchToProps = {
  finishFirstVisit
};

export default connect(null, mapDispatchToProps)(LoginSignUpScreen);
