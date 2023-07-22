import React, { Fragment, PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { activate } from './Activate.actions';
import { connect } from 'react-redux';
import './Activate.css';
import { login } from '../Login/Login.actions';
import { isLogged } from '../../App/App.selectors';

import { FormattedMessage } from 'react-intl';
import messages from './Activate.messages';

class ActivateContainer extends PureComponent {
  state = {
    isActivating: false,
    activationStatus: {}
  };

  componentDidMount() {
    const {
      match: {
        params: { url }
      }
    } = this.props;

    this.setState({ isActivating: true });

    activate(url)
      .then(activationStatus => {
        this.setState({ activationStatus });
        if (activationStatus.success) {
          this.props.login({ activatedData: activationStatus }).catch(error => {
            console.log(error);
            this.handleError();
          });
          return;
        }
        this.handleError();
      })
      .catch(activationStatus => this.setState({ activationStatus }))
      .finally(() => this.setState({ isActivating: false }));
  }

  componentDidUpdate(prevProps) {
    const { isLogged, history } = this.props;
    if (!prevProps.isLogged && isLogged) {
      setTimeout(() => {
        history.replace('/');
      }, 2000);
    }
  }

  handleError() {
    this.setState({ error: true });
    setTimeout(() => {
      this.props.history.replace('/login-signup');
    }, 2000);
  }

  render() {
    const { isActivating, activationStatus, error } = this.state;
    const loginSuccess = !error && this.props.isLogged;

    const startTourLink = (
      <Link to="/" className="Activate_home">
        <FormattedMessage {...messages.startTour} />
      </Link>
    );

    return (
      <div className="Activate">
        {isActivating || (!loginSuccess && !error) ? (
          'Activating your account...'
        ) : (
          <Fragment>
            {activationStatus.message}
            <br />
            {loginSuccess ? (
              startTourLink
            ) : (
              <Link to="/login-signup" className="Activate_home">
                <FormattedMessage {...messages.loginSignUpPage} />
              </Link>
            )}
          </Fragment>
        )}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  isLogged: isLogged(state)
});

const mapDispatchToProps = {
  login
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivateContainer);
