import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import Scanning from './Scanning.component';
import { updateScannerSettings } from '../../../providers/ScannerProvider/ScannerProvider.actions';
import API from '../../../api';

export class ScanningContainer extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired
  };

  updateScannerSettings = async (scanningSettings) => {
    try {
      await API.updateSettings({ scanning: scanningSettings });
    } catch (e) { }
    this.props.updateScannerSettings(scanningSettings);
  };

  render() {
    const { history, scanningSettings } = this.props;

    return (
      <Scanning
        onClose={history.goBack}
        updateScannerSettings={this.updateScannerSettings}
        scanningSettings={scanningSettings}
      />
    );
  }
}

ScanningContainer.props = {
  history: PropTypes.object,
  updateScannerSettings: PropTypes.func.isRequired,
  scanningSettings: PropTypes.object.isRequired
};

const mapStateToProps = ({ scanner: scanningSettings }) => ({
  scanningSettings
});

const mapDispatchToProps = {
  updateScannerSettings
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(ScanningContainer));
