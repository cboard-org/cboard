import { connect } from 'react-redux';

import GazeSwitchProvider from './GazeSwitchProvider.component';

const mapStateToProps = (state) => {
  const gaze = state.gazeSwitch || {};
  return {
    active: gaze.active,
    blinkThreshold: gaze.blinkThreshold,
    dwellMs: gaze.dwellMs,
    cooldownMs: gaze.cooldownMs,
    showPreview: gaze.showPreview,
    scannerActive: state.scanner.active
  };
};

export default connect(mapStateToProps)(GazeSwitchProvider);
