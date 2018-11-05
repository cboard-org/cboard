import React from 'react';

export default class VoiceRecorder extends React.Component {
  state = {
    record: false,
    mediaRecorder: '',
    chunks: '',
    audioURL: ''
  };

  render() {
    return (
      <div>
        <button onClick={this.startRecording}>start</button>
        <audio id="js-audio" src={this.state.audioURL} controls />
      </div>
    );
  }
  startRecording = () => {
    if (this.state.record) {
      this.state.mediaRecorder.stop();
      let dat = this.state.mediaRecorder;
      dat.ondataavailable = e => {
        this.setState({ chunks: e.data });
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
        })
        .catch(function(err) {
          console.log(err.name + ': ' + err.message);
        });
    }
  };
}
