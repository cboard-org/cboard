import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import getOrientedImage from 'exif-orientation-image';

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

class InputImage extends PureComponent {
  handleChange = (event) => {
    const file = event.target.files[0];

    getOrientedImage(file, (error, canvas) => {
      if (!error) {
        const dataURL = canvas.toDataURL('image/png');
        this.props.onChange(dataURL);
      }
    });
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
