import React, { Component } from 'react';
import { connect } from 'react-redux';

import VoiceRecorder from './VoiceRecorder';
import { addRecord } from './VoiceRecorder.actions';

class VoiceRecorderContainer extends Component {
  handleChange = audioURL => {
    const { addRecord } = this.props;
    addRecord(audioURL);
  };

  render() {
    const { audioURL } = this.props;
    return <VoiceRecorder audioURL={audioURL} onChange={this.handleChange} />;
  }
}

function mapStateToProps(state) {
  return {
    audioURL: state.voiceRecorder.audioURL
  };
}

const mapDispatchToProps = {
  addRecord
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VoiceRecorderContainer);
