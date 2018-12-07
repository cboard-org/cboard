import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MicIcon from '@material-ui/icons/Mic';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ClearIcon from '@material-ui/icons/Clear';

import IconButton from '../UI/IconButton';
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

  playAudio = src => {
    const audio = new Audio();
    audio.src = src;
    audio.play();
  };

  handleRecordClick = () => {
    if (this.state.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  };

  handlePlayClick = () => {
    const { src } = this.props;
    this.playAudio(src);
  };

  handleClear = () => {
    const { onChange } = this.props;
    onChange('');
  };

  render() {
    const { src } = this.props;
    const color = this.state.isRecording ? 'red' : 'black';
    const style = {
      color
    };

    return (
      <div className="VoiceRecorder">
        <IconButton onClick={this.handleRecordClick} label="Record">
          <MicIcon style={style} />
        </IconButton>
        {src && (
          <>
            <IconButton onClick={this.handlePlayClick} label="Play recording">
              <PlayArrowIcon />
            </IconButton>
            <IconButton onClick={this.handleClear} label="Clear recording">
              <ClearIcon />
            </IconButton>
          </>
        )}
      </div>
    );
  }
}

export default VoiceRecorder;
