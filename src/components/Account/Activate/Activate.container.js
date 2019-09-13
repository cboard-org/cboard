import React, { Fragment, PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { activate } from './Activate.actions';
import './Activate.css';

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
      .then(activationStatus => this.setState({ activationStatus }))
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

export default ActivateContainer;
