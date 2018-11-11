import React from 'react';
import Mic from '@material-ui/icons/Mic';
import './VoiceRecorder.css';

export default class VoiceRecorder extends React.Component {
  state = {
    audioURL: '',
    iconsColor: 'black'
  };

  startRecording = () => {
    if (this.record) {
      this.mediaRecorder.stop();
      let dat = this.mediaRecorder;
      dat.ondataavailable = e => {
        this.chunks = e.data;
        this.setState({ iconsColor: 'black' });
        this.record = false;
      };
      dat.onstop = () => {
        let chunksForBlob = this.chunks;
        this.chunks = '';
        this.setState({ audioURL: window.URL.createObjectURL(chunksForBlob) });
      };
    } else {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(stream => {
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.start();
          this.record = true;
          this.setState({ iconsColor: 'red' });
        })
        .catch(function(err) {
          console.log(err.name + ': ' + err.message);
        });
    }
  };
  render() {
    const styles = {
      color: this.state.iconsColor
    };
    return (
      <div className="VoiceRecorder">
        <Mic onClick={this.startRecording} style={styles} />
        <audio src={this.state.audioURL} controls />
      </div>
    );
  }
}
