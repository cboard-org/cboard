import React, { PureComponent, PropTypes } from 'react';
import classnames from 'classnames';

class addButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: 'button',
      image: '',
      label: 'default label',
      text: 'default text',
      link: '',
    };
  }

  getBase64Image(img, width = img.width, height = img.height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    var dataURL = canvas.toDataURL('image/png');
    return dataURL;
    // return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }

  handleImageChange = event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = event => {
      const img = document.createElement('img');
      const width = 512;
      const height = 512;

      img.onload = event => {
        const imageData = this.getBase64Image(event.target, width, height);
        const dataURL = '' + imageData;
        this.setState({ img: dataURL });
      }
      img.src = event.target.result;
    }

    reader.readAsDataURL(file);


  }

  handleLabelChange = event => {
    this.setState({ label: event.target.value });
  }

  handleTextChange = event => {
    this.setState({ text: event.target.value });
  }

  handleSubmit = event => {
    this.props.onAdd(this.state);
    this.props.onClose();
  }

  render() {
    const addButtonClasses = classnames({
      'add-button': true
    });

    return (
      <div className={addButtonClasses}>
        <button className="add-button__close" onClick={this.props.onClose}>Close</button>
        <form>
          <label>
            Image
            <input className="add-button__image" type="file" accept="image/*" onChange={this.handleImageChange} />
          </label>
          <label>
            Label
            <input className="add-button__label" type="text" value={this.state.label} onChange={this.handleLabelChange} />
          </label>
          <label>
            Text
            <input className="add-button__text" type="text" value={this.state.text} onChange={this.handleTextChange} />
          </label>
          <button className="add-button__submit" type="button" onClick={this.handleSubmit}>Submit</button>
        </form>
      </div>
    );
  }
}

addButton.propTypes = {
}

export default addButton;