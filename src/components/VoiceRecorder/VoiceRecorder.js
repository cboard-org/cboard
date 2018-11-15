import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Mic from '@material-ui/icons/Mic';

import './VoiceRecorder.css';

class VoiceRecorder extends Component {
  static propTypes = {
    /**
     * Audio blob
     */
    audioURL: PropTypes.string,
    /**
     * Callback, fired when audio recording changes
     */
    onChange: PropTypes.func.isRequired
  };

  state = {
    isRecording: false
  };

  startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.setState({ isRecording: true });
      })
      .catch(function(err) {
        console.log(err.name + ': ' + err.message);
      });
  };

  stopRecording = () => {
    this.mediaRecorder.stop();

    this.mediaRecorder.ondataavailable = e => {
      this.chunks = e.data;
      this.setState({ isRecording: false });
    };

    this.mediaRecorder.onstop = () => {
      const { onChange } = this.props;
      const chunksForBlob = this.chunks;

      if (onChange) {
        onChange(window.URL.createObjectURL(chunksForBlob));
      }

      this.chunks = '';
    };
  };

  handleClick = () => {
    if (this.state.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  };

  render() {
    const { audioURL } = this.props;
    const color = this.state.isRecording ? 'red' : 'black';
    const styles = {
      color
    };

    return (
      <div className="VoiceRecorder">
        <Mic onClick={this.handleClick} style={styles} />
        <audio src={audioURL} controls />
      </div>
    );
  }
}

export default VoiceRecorder;
