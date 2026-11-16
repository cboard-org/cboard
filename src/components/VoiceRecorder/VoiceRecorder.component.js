import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import MicIcon from '@material-ui/icons/Mic';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ClearIcon from '@material-ui/icons/Clear';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import FormHelperText from '@material-ui/core/FormHelperText';
import LinearProgress from '@material-ui/core/LinearProgress';

import IconButton from '../UI/IconButton';
import messages from './VoiceRecorder.messages';
import './VoiceRecorder.css';
let mediaStream = undefined;
export class VoiceRecorder extends Component {
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
    user: PropTypes.object,
    intl: intlShape.isRequired
  };

  state = {
    isRecording: false,
    isPlaying: false,
    isReadingFile: false,
    audioFileError: false
  };

  audioInput = createRef();

  componentWillUnmount() {
    if (this.audioReader) {
      this.audioReader.onloadend = null;
      this.audioReader.abort();
    }
  }

  handleAudioFileChange = (event) => {
    const input = event.currentTarget;
    const file = input.files[0];
    input.value = '';
    if (!file) return;

    if (!file.size || !file.type.startsWith('audio/')) {
      this.setState({ audioFileError: true });
      return;
    }

    const reader = new FileReader();
    this.audioReader = reader;
    this.setState({ isReadingFile: true, audioFileError: false });
    reader.onloadend = () => {
      this.audioReader = null;
      const sound = reader.result;
      this.setState({
        isReadingFile: false,
        audioFileError: typeof sound !== 'string'
      });
      if (typeof sound === 'string') this.props.onChange(sound);
    };
    reader.readAsDataURL(file);
  };

  startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new window.MediaRecorder(stream);
        this.mediaRecorder.start();
        this.setState({ isRecording: true });
        mediaStream = stream;
      })
      .catch(function (err) {
        console.log(err.message);
      });
  };

  stopRecording = () => {
    this.mediaRecorder.stop();
    try {
      if (mediaStream) mediaStream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error('Error during stop recording', error);
    }

    this.mediaRecorder.ondataavailable = (event) => {
      this.chunks = event.data;
      this.setState({ isRecording: false });
    };

    this.mediaRecorder.onstop = () => {
      const { onChange } = this.props;
      let audio;

      const reader = new window.FileReader();
      reader.readAsDataURL(this.chunks);
      const mediaReader = new window.FileReader();
      mediaReader.readAsArrayBuffer(this.chunks);

      reader.onloadend = async () => {
        audio = reader.result;
        if (onChange) {
          onChange(audio);
        }
      };
      this.chunks = '';
    };
  };

  playAudio = (src) => {
    const audio = new Audio();
    audio.src = src;
    audio.addEventListener('ended', () => {
      this.setState({ isPlaying: false });
    });
    audio.play();
  };

  handleRecordClick = () => {
    if (this.state.isRecording) {
      this.stopRecording();
    } else {
      this.setState({ audioFileError: false });
      this.startRecording();
    }
  };

  handlePlayClick = () => {
    const { src } = this.props;
    this.setState({ isPlaying: true });
    this.playAudio(src);
  };

  handleClear = () => {
    const { onChange } = this.props;
    this.setState({ audioFileError: false });
    onChange('');
  };

  render() {
    const { src, intl } = this.props;
    const { isRecording, isPlaying, isReadingFile, audioFileError } =
      this.state;
    const recordStyle = {
      color: isRecording ? 'red' : 'grey'
    };
    const playStyle = {
      color: isPlaying ? 'green' : 'grey'
    };

    return (
      <div className="VoiceRecorder">
        <IconButton
          onClick={this.handleRecordClick}
          label={intl.formatMessage(messages.record)}
          disabled={isReadingFile}
        >
          <MicIcon fontSize="large" style={recordStyle} />
        </IconButton>
        <IconButton
          onClick={() => this.audioInput.current.click()}
          label={intl.formatMessage(messages.attachAudioFile)}
          disabled={isRecording || isPlaying || isReadingFile}
        >
          <AttachFileIcon fontSize="large" />
        </IconButton>
        <input
          ref={this.audioInput}
          type="file"
          accept="audio/*"
          hidden
          onChange={this.handleAudioFileChange}
        />
        {(isRecording || isReadingFile) && (
          <div className="VoiceRecorder__progress">
            <LinearProgress color="secondary" />
          </div>
        )}
        {src && !isRecording && !isReadingFile && (
          <>
            <IconButton
              onClick={this.handlePlayClick}
              label={intl.formatMessage(messages.play)}
            >
              <PlayArrowIcon fontSize="large" style={playStyle} />
            </IconButton>
            <IconButton
              onClick={this.handleClear}
              label={intl.formatMessage(messages.clear)}
            >
              <ClearIcon fontSize="large" style={{ color: 'grey' }} />
            </IconButton>
          </>
        )}
        {audioFileError && (
          <FormHelperText
            className="VoiceRecorder__file-error"
            error
            role="alert"
          >
            {intl.formatMessage(messages.audioFileError)}
          </FormHelperText>
        )}
      </div>
    );
  }
}

export default injectIntl(VoiceRecorder);
