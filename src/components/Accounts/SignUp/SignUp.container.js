import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SignUpComponent from './SignUp.component';
import { signUp } from './SignUp.actions';
import { getLangsOptions } from './SignUp.selectors';

class SignUpContainer extends Component {
  static propTypes = {
    isSigningUp: PropTypes.bool.isRequired,
    langs: PropTypes.array.isRequired,
    signUp: PropTypes.func.isRequired
  };

  handleSubmit = values => {
    const { signUp } = this.props;
    const { passwordConfirm, ...formValues } = values;

    signUp(formValues);
  };

  render() {
    const { signUp, ...rest } = this.props;

    return <SignUpComponent {...rest} handleSubmit={this.handleSubmit} />;
  }
}

const mapStateToProps = state => ({
  langs: getLangsOptions(state),
  isSigningUp: state.app.isSigningUp
});

const mapDispatchToProps = {
  signUp
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpContainer);
