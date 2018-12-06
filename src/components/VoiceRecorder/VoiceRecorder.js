import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Mic from '@material-ui/icons/Mic';

import './VoiceRecorder.css';

class VoiceRecorder extends Component {
  static propTypes = {
    /**
     * Audio source
     */
    src: PropTypes.string,
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
        this.mediaRecorder = new window.MediaRecorder(stream);
        this.mediaRecorder.start();
        this.setState({ isRecording: true });
      })
      .catch(function(err) {
        console.log(err.name + ': ' + err.message);
      });
  };

  stopRecording = () => {
    this.mediaRecorder.stop();

    this.mediaRecorder.ondataavailable = event => {
      this.chunks = event.data;
      this.setState({ isRecording: false });
    };

    this.mediaRecorder.onstop = () => {
      const { onChange } = this.props;
      let base64;

      const reader = new window.FileReader();
      reader.readAsDataURL(this.chunks);

      reader.onloadend = () => {
        base64 = reader.result;
        if (onChange) {
          onChange(base64);
        }
      };

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
    const { src } = this.props;
    const color = this.state.isRecording ? 'red' : 'black';
    const styles = {
      color
    };

    return (
      <div className="VoiceRecorder">
        <Mic onClick={this.handleClick} style={styles} />
        <audio src={src} controls />
      </div>
    );
  }
}

export default VoiceRecorder;
