import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

const styles = {
  imageInput: {
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
        this.props.onChange(imageData);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    this.input.value = '';
  }

  render() {
    return (
      <div>
        <RaisedButton
          label="Choose an Image"
          containerElement="label"
          icon={<FontIcon className="material-icons">add_a_photo</FontIcon>}
        >
          <input type="file" style={styles.imageInput} onChange={this.handleChange} ref={(input) => { this.input = input; }} />
        </RaisedButton>
      </div >
    );
  }
}

export default InputImage;

InputImage.propTypes = {
  onChange: PropTypes.func.isRequired,
};
