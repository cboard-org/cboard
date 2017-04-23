import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { injectIntl, FormattedMessage } from 'react-intl';
import Autosuggest from 'react-autosuggest';
import classnames from 'classnames';

import mulberrySymbols from '../../api/mulberry-symbols';

const getSuggestionValue = suggestion => suggestion.name;
const shouldRenderSuggestions = value => value.trim().length > 1;
const renderSuggestion = suggestion => (
  <div>
    <img width="25" height="25" src={suggestion.src} alt="" />
    <FormattedMessage id={suggestion.name} />
  </div>
);

class addButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imageSearchValue: '',
      imageSuggestions: [],
      type: '',
      img: '',
      label: '',
      text: '',
      link: ''
    };
  }

  componentDidMount() {
    this.autoSuggest.input.focus();
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
    // const messages = this.props.messages;

    let suggestions = inputLength === 0 ? [] : mulberrySymbols.filter(symbol => {
      const words =
        this.props.intl.formatMessage({ id: symbol.name })
          .replace(/[\u0591-\u05C7]/g, '')
          .toLowerCase()
          .split(' ');

      let filtered;

      for (let i = 0; i < words.length; i++) {
        filtered = words[i].slice(0, inputLength) === inputValue;
        if (filtered) { break; }
      }

      return filtered;
    });

    return suggestions;
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    const imageSuggestions = this.getSuggestions(value);
    this.setState({ imageSuggestions });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      imageSuggestions: []
    });
  }

  handleImageSearchChange = (event, { newValue }) => {
    if (newValue !== event.target.value) {
      newValue = this.props.intl.formatMessage({ id: newValue })
    }
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

  handleTypeChange = event => {
    this.setState({ type: event.target.checked });
  }

  handleLinkChange = event => {
    this.setState({ link: event.target.value });
  }

  handleSubmit = event => {
    const { type, label, text, img, link } = this.state;
    const button = {
      type: type ? 'link' : 'button',
      label: label,
      text: text,
      img: img,
      link: link
    };
    this.props.onAdd(button);
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
        <form>
          <Autosuggest
            suggestions={imageSuggestions}
            onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
            onSuggestionSelected={this.handleSuggestionSelected}
            getSuggestionValue={getSuggestionValue}
            shouldRenderSuggestions={shouldRenderSuggestions}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            ref={autoSuggest => this.autoSuggest = autoSuggest}
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
          <label>
            Link
            <input className="add-button__type" type="checkbox" value={this.state.type} onChange={this.handleTypeChange} />
          </label>
          {this.state.type && <label>
            Board ID
            <input className="add-button__text" type="text" value={this.state.link} onChange={this.handleLinkChange} />
          </label>}
          <button className="add-button__submit" type="button" onClick={this.handleSubmit}>Submit</button>
        </form>
      </div>
    );
  }
}

addButton.propTypes = {
  onAdd: PropTypes.func.isRequired,
}

export default injectIntl(addButton);