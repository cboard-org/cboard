import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { activate } from './Activate.actions';
import './Activate.css';

class ActivateContainer extends PureComponent {
  componentDidMount() {
    const {
      activate,
      match: {
        params: { url }
      }
    } = this.props;

    activate(url);
  }

  render() {
    const { isActivating, activationStatus } = this.props;

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

const mapStateToProps = state => ({
  activationStatus: state.app.activationStatus,
  isActivating: state.app.isActivating
});

const mapDispatchToProps = {
  activate
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivateContainer);
