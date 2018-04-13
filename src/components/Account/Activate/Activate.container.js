import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
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
          <div>Activating your account...</div>
        ) : (
          <div>{activationStatus.message}</div>
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
