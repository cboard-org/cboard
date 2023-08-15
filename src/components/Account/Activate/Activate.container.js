import React, { Fragment, PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { activate } from './Activate.actions';
import './Activate.css';

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
          setTimeout(() => {
            this.props.history.replace('/login-signup');
          }, 2000);
          return;
        }
        this.handleError();
      })
      .catch(activationStatus => {
        this.setState({ activationStatus });
        this.handleError();
      })
      .finally(() => this.setState({ isActivating: false }));
  }

  handleError() {
    this.setState({ error: true });
    setTimeout(() => {
      this.props.history.replace('/login-signup');
    }, 2000);
  }

  render() {
    const { isActivating, error } = this.state;

    return (
      <div className="Activate">
        {isActivating ? (
          <FormattedMessage {...messages.activating} />
        ) : (
          <Fragment>
            {error ? (
              <FormattedMessage {...messages.error} />
            ) : (
              <FormattedMessage {...messages.success} />
            )}
            <br />
            <Link to="/login-signup" className="Activate_home">
              <FormattedMessage {...messages.loginSignUpPage} />
            </Link>
          </Fragment>
        )}
      </div>
    );
  }
}

export default ActivateContainer;
