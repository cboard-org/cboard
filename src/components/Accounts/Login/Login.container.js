import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoginComponent from './Login.component';
import { login } from './Login.actions';

class LoginContainer extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired
  };

  handleSubmit = values => {
    const { login } = this.props;
    debugger;
    login(values);
  };

  render() {
    return <LoginComponent {...this.props} handleSubmit={this.handleSubmit} />;
  }
}

const mapStateToProps = state => ({
  isLogging: state.app.isLogging
});

const mapDispatchToProps = {
  login
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
