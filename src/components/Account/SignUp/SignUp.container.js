import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SignUp from './SignUp.component';
import { signUp } from './SignUp.actions';

class SignUpContainer extends Component {
  static propTypes = {
    isSigningUp: PropTypes.bool.isRequired,
    signUp: PropTypes.func.isRequired
  };

  handleSubmit = values => {
    const { signUp } = this.props;
    const { passwordConfirm, ...formValues } = values;
    signUp(formValues);
  };

  render() {
    const { signUp, ...rest } = this.props;
    return <SignUp {...rest} handleSubmit={this.handleSubmit} />;
  }
}

const mapStateToProps = state => ({
  signUpStatus: state.app.signUpStatus,
  isSigningUp: state.app.isSigningUp
});

const mapDispatchToProps = {
  signUp
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpContainer);
