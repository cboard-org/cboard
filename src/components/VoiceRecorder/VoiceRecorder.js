import React from 'react';
import { connect } from 'react-redux';
import { addRecord } from './VoiceRecorder.actions';
import { startRecord } from './VoiceRecorder.actions';
import Mic from '@material-ui/icons/Mic';
import './VoiceRecorder.css';

class VoiceRecorder extends React.Component {
  handleClick = () => {
    if (this.record) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  };
  startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.record = true;
        this.props.startRecord('red');
      })
      .catch(function(err) {
        console.log(err.name + ': ' + err.message);
      });
  };
  stopRecording = () => {
    this.mediaRecorder.stop();
    let dat = this.mediaRecorder;
    dat.ondataavailable = e => {
      this.chunks = e.data;
      this.record = false;
    };
    dat.onstop = () => {
      let chunksForBlob = this.chunks;
      this.props.addRecord(window.URL.createObjectURL(chunksForBlob));
      this.chunks = '';
    };
  };

  render() {
    const TrackBlob = this.props.audioURL;
    const styles = {
      color: this.props.colorMic
    };
    return (
      <div className="VoiceRecorder">
        <Mic onClick={this.handleClick} style={styles} />
        <audio src={TrackBlob} controls />
      </div>
    );
  }
}
function mapStateToProps(store) {
  return {
    audioURL: store.track.audioURL,
    colorMic: store.track.iconsColor
  };
}

const mapDispatchToProps = {
  addRecord,
  startRecord
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VoiceRecorder);
