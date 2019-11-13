import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MicIcon from '@material-ui/icons/Mic';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ClearIcon from '@material-ui/icons/Clear';
import CircularProgress from '@material-ui/core/CircularProgress';

import API from '../../api';
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
    onChange: PropTypes.func.isRequired,
    /**
     * User info
     */
    user: PropTypes.object
  };

  state = {
    isRecording: false,
    loading: false
  };

  startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new window.MediaRecorder(stream);
        this.mediaRecorder.start();
        this.setState({ isRecording: true });
      })
      .catch(function(err) {});
  };

  stopRecording = () => {
    this.mediaRecorder.stop();

    this.mediaRecorder.ondataavailable = event => {
      this.chunks = event.data;
      this.setState({ isRecording: false });
    };

    this.mediaRecorder.onstop = () => {
      const { onChange, user } = this.props;
      let audio;

      const reader = new window.FileReader();
      reader.readAsDataURL(this.chunks);
      const mediaReader = new window.FileReader();
      mediaReader.readAsArrayBuffer(this.chunks);

      reader.onloadend = async () => {
        audio = reader.result;
        if (onChange) {
          // Loggedin user?
          if (user) {
            this.setState({
              loading: true
            });
            var blob = new Blob([mediaReader.result], {
              type: 'audio/ogg; codecs=opus'
            });
            try {
              const audioUrl = await API.uploadFile(blob, user.email + '.ogg');
              audio = audioUrl;
            } catch (err) {
            } finally {
              this.setState({
                loading: false
              });
            }
          }
          onChange(audio);
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
        {this.state.loading ? (
          <CircularProgress size={24} thickness={7} />
        ) : (
          <IconButton onClick={this.handleRecordClick} label="Record">
            <MicIcon style={style} />
          </IconButton>
        )}
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
