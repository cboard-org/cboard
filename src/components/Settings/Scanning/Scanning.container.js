import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import Scanning from './Scanning.component';
import { updateScannerSettings } from '../../../providers/ScannerProvider/ScannerProvider.actions';
import { updateGazeSwitchSettings } from '../../../providers/GazeSwitchProvider/GazeSwitchProvider.actions';
import API from '../../../api';

export class ScanningContainer extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired
  };

  updateScannerSettings = async (scanningSettings) => {
    try {
      await API.updateSettings({ scanning: scanningSettings });
    } catch (e) {}
    this.props.updateScannerSettings(scanningSettings);
  };

  render() {
    const { history, scanningSettings, gazeSwitchSettings } = this.props;

    return (
      <Scanning
        onClose={history.goBack}
        updateScannerSettings={this.updateScannerSettings}
        scanningSettings={scanningSettings}
        updateGazeSwitchSettings={this.props.updateGazeSwitchSettings}
        gazeSwitchSettings={gazeSwitchSettings}
      />
    );
  }
}

ScanningContainer.props = {
  history: PropTypes.object,
  updateScannerSettings: PropTypes.func.isRequired,
  scanningSettings: PropTypes.object.isRequired,
  updateGazeSwitchSettings: PropTypes.func.isRequired,
  gazeSwitchSettings: PropTypes.object.isRequired
};

const mapStateToProps = ({
  scanner: scanningSettings,
  gazeSwitch: gazeSwitchSettings
}) => ({
  scanningSettings,
  gazeSwitchSettings
});

const mapDispatchToProps = {
  updateScannerSettings,
  updateGazeSwitchSettings
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(ScanningContainer));
