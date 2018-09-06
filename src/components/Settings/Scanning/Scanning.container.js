import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import Scanning from './Scanning.component';
import { updateScannerSettings } from '../../../providers/ScannerProvider/ScannerProvider.actions';

export class ScanningContainer extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired
  };

  render() {
    const { history, updateScannerSettings, scanningSettings } = this.props;

    return (
      <Scanning
        onClose={history.goBack}
        updateScannerSettings={updateScannerSettings}
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
