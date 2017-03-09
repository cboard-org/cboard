import React, { PureComponent, PropTypes } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import Autosuggest from 'react-autosuggest';
import classnames from 'classnames';

import mulberrySymbols from '../../api/mulberry-symbols';

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => (
  <div>
    <FormattedMessage id={suggestion.name} />
    <img width="25" height="25" src={suggestion.src} />
  </div>
);

class addButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imageSearchValue: '',
      imageSuggestions: [],
      type: 'button',
      img: '',
      label: 'default label',
      text: 'default text',
      link: ''
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
  }

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const messages = this.props.messages;

    return inputLength === 0 ? [] : mulberrySymbols.filter(symbol => {
      const filtered =
       this.props.intl.formatMessage({ id: symbol.name }).replace(/[\u0591-\u05C7]/g, '').toLowerCase().slice(0, inputLength) === inputValue;
      return filtered;
    });
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      imageSuggestions: this.getSuggestions(value)
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      imageSuggestions: []
    });
  }

  handleImageSearchChange = (event, { newValue }) => {
    this.setState({
      imageSearchValue: newValue
    });
  }

  handleSuggestionSelected = (event, { suggestion }) => {
    this.setState({ img: suggestion.src, label: suggestion.name, text: '' });
  }

  handleImageUpload = event => {
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
    const { type, label, text, img, link } = this.state;
    const button = {
      type: type,
      label: label,
      text: text,
      img: img,
      link: link
    };
    this.props.onAdd(button);
    this.props.onClose();
  }

  render() {
    const addButtonClasses = classnames({
      'add-button': true
    });

    const { imageSearchValue, imageSuggestions } = this.state;

    // Autosuggest will pass through all these props to the input element.
    const inputProps = {
      placeholder: 'Type an image name',
      value: imageSearchValue,
      onChange: this.handleImageSearchChange
    };

    return (
      <div className={addButtonClasses}>
        <button className="add-button__close" onClick={this.props.onClose}>Close</button>
        <form>
          <Autosuggest
            suggestions={imageSuggestions}
            onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
            onSuggestionSelected={this.handleSuggestionSelected}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
          <label>
            Image
            <input className="add-button__image" type="file" accept="image/*" onChange={this.handleImageUpload} />
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

export default injectIntl(addButton);