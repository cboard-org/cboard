import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};
const getBase64Image = (img, width = img.width, height = img.height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);

  const dataURL = canvas.toDataURL('image/png');
  return dataURL;
};

class InputImage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      src: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (ev) => {
      const img = document.createElement('img');
      const width = 512;
      const height = 512;

      img.onload = (e) => {
        const imageData = getBase64Image(e.target, width, height);
        const dataURL = `${imageData}`;
        this.setState({ src: dataURL });
      };

      img.src = ev.target.result;
    };

    reader.readAsDataURL(file);
  }

  render() {
    return (
      <div>
        <div className="image-placeholder">
          <img src={this.state.src} alt="" />
        </div>
        <RaisedButton
          label="Choose an Image"
          labelPosition="before"
          containerElement="label"
        >
          <input type="file" style={styles.exampleImageInput} onChange={this.handleChange} />
        </RaisedButton>
      </div>
    );
  }
}

export default InputImage;

InputImage.propTypes = {
  onChange: PropTypes.func.isRequired,
};

InputImage.defaultProps = {

};
