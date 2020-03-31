import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { updateDisplaySettings } from '../../App/App.actions';
import Display from './Display.component';
import API from '../../../api';

export class DisplayContainer extends PureComponent {
  updateDisplaySettings = async displaySettings => {
    try {
      await API.updateSettings({ display: displaySettings });
    } catch (e) {}
    this.props.updateDisplaySettingsAction(displaySettings);
  };

  render() {
    const { history } = this.props;
    return (
      <Display
        {...this.props}
        updateDisplaySettings={this.updateDisplaySettings}
        onClose={history.goBack}
      />
    );
  }
}

DisplayContainer.props = {
  intl: intlShape.isRequired,
  displaySettings: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  updateDisplaySettings: PropTypes.func
};

const mapStateToProps = ({ app: { displaySettings } }) => ({ displaySettings });

const mapDispatchToProps = {
  updateDisplaySettingsAction: updateDisplaySettings
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(DisplayContainer));
