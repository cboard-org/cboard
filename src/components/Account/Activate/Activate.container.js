import React, { Fragment, PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { activate } from './Activate.actions';
import { connect } from 'react-redux';
import './Activate.css';
import { login } from '../Login/Login.actions';

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
        this.props
          .login({ activatedData: activationStatus })
          .finally(() => (window.location.href = '/'));
        this.setState({ activationStatus });
      })
      .catch(activationStatus => this.setState({ activationStatus }))
      .finally(() => this.setState({ isActivating: false }));
  }

  render() {
    const { isActivating, activationStatus } = this.state;

    return (
      <div className="Activate">
        {isActivating ? (
          'Activating your account...'
        ) : (
          <Fragment>
            {activationStatus.message}
            <br />
            <Link to="/" className="Activate_home">
              Home page
            </Link>
          </Fragment>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = {
  login
};

export default connect(
  null,
  mapDispatchToProps
)(ActivateContainer);
