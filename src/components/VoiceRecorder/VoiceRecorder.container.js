import React from 'react';
import { connect } from 'react-redux';
import VoiceRecorder from './VoiceRecorder.component';

const VoiceRecorderContainer = props => <VoiceRecorder {...props} />;

const mapStateToProps = ({ app: { userData } }, ownProps) => ({
  ...ownProps,
  user: userData.email ? userData : null
});

export default connect(mapStateToProps)(VoiceRecorderContainer);
