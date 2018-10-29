import React from 'react';

export default class VoiceRecorder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      mediaRecorder: '',
      churk: '',
      audioURL: ''
    };
  }
  render() {
    return (
      <div>
        <button onClick={this.startRecording.bind(this)}>start</button>

        <audio id="js-audio" src={this.state.audioURL} controls />
      </div>
    );
  }
  onRecorder() {
    console.log(this.startRecording());
  }
  startRecording() {
    if (this.state.record) {
      this.state.mediaRecorder.stop();
      let dat = this.state.mediaRecorder;
      dat.ondataavailable = e => {
        this.setState({ chunks: e.data });
        this.setState({ record: false });
      };
      dat.onstop = () => {
        let chunksForBlob = this.state.chunks;
        console.log(chunksForBlob);
        this.setState({ chunks: '' });
        this.setState({ audioURL: window.URL.createObjectURL(chunksForBlob) });
      };
    } else {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(stream => {
          this.setState({ mediaRecorder: new MediaRecorder(stream) });
          console.log(this.state.mediaRecorder);
          console.log(this);
          this.state.mediaRecorder.start();
          this.setState({ record: true });
        })
        .catch(function(err) {
          console.log(err.name + ': ' + err.message);
        });
    }
  }

  stopRecording() {
    this.setState({
      record: false
    });
  }

  onData(recordedBlob) {
    console.log('chunk of real-time data is: ', recordedBlob);
  }

  onStop(recordedBlob) {
    console.log('recordedBlob is: ', recordedBlob);
  }
}
