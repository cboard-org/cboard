import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MicIcon from '@material-ui/icons/Mic';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ClearIcon from '@material-ui/icons/Clear';

import IconButton from '../UI/IconButton';
import './VoiceRecorder.css';

window.MediaRecorder = require('audio-recorder-polyfill');

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
        this.recorder = new window.MediaRecorder(stream);

        this.recorder.addEventListener('dataavailable', event => {
          this.chunks = event.data;
          this.setState({ isRecording: false });
        });

        this.recorder.addEventListener('stop', event => {
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
        });

        this.recorder.start();
        this.setState({ isRecording: true });
      })
      .catch(function(err) {
        console.log(err.name + ': ' + err.message);
      });
  };

  stopRecording = () => {
    this.recorder.stop();
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
