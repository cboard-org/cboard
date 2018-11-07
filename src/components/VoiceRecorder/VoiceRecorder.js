import React from 'react';
import Mic from '@material-ui/icons/Mic';
import './VoiceRecorder.css';

export default class VoiceRecorder extends React.Component {
  state = {
    record: false,
    mediaRecorder: '',
    chunks: '',
    audioURL: '',
    iconsColor: 'black'
  };

  render() {
    const styles = {
      color: this.state.iconsColor
    };
    return (
      <div className="container-for-recorder">
        <Mic onClick={this.startRecording} style={styles} />
        <audio src={this.state.audioURL} controls />
      </div>
    );
  }

  startRecording = () => {
    if (this.state.record) {
      this.state.mediaRecorder.stop();
      let dat = this.state.mediaRecorder;
      dat.ondataavailable = e => {
        this.setState({ chunks: e.data });
        this.setState({ iconsColor: 'black' });
        this.setState({ record: false });
      };
      dat.onstop = () => {
        let chunksForBlob = this.state.chunks;
        this.setState({ chunks: '' });
        this.setState({ audioURL: window.URL.createObjectURL(chunksForBlob) });
      };
    } else {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(stream => {
          this.setState({ mediaRecorder: new MediaRecorder(stream) });
          this.state.mediaRecorder.start();
          this.setState({ record: true });
          this.setState({ iconsColor: 'red' });
        })
        .catch(function(err) {
          console.log(err.name + ': ' + err.message);
        });
    }
  };
}
