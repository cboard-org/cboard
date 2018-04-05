import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Login from './Login.component';
import { login } from './Login.actions';

class LoginContainer extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired
  };

  handleSubmit = values => {
    const { login } = this.props;
    login(values);
  };

  render() {
    const { loginStatus } = this.props;
    return (
      <Login
        {...this.props}
        loginStatus={loginStatus}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

const mapStateToProps = state => ({
  loginStatus: state.app.loginStatus,
  isLogging: state.app.isLogging
});

const mapDispatchToProps = {
  login
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
