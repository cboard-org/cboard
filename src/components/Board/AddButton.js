import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import Autosuggest from 'react-autosuggest';
import classnames from 'classnames';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

import mulberrySymbols from '../../api/mulberry-symbols.json';
import InputImage from '../InputImage';
import '../../styles/AddButton.css';

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
      link: '',
    };

    this.handleSuggestionsFetchRequested = this.handleSuggestionsFetchRequested.bind(this);
    this.handleSuggestionsClearRequested = this.handleSuggestionsClearRequested.bind(this);
    this.handleImageSearchChange = this.handleImageSearchChange.bind(this);
    this.handleSuggestionSelected = this.handleSuggestionSelected.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleLabelChange = this.handleLabelChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleLinkChange = this.handleLinkChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.autoSuggest.input.focus();
  }

  getBase64Image(img, width = img.width, height = img.height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    const dataURL = canvas.toDataURL('image/png');
    return dataURL;
  }

  getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const suggestions = inputLength !== 0 ?
      mulberrySymbols.filter((symbol) => {
        const words =
          this.props.intl.formatMessage({ id: symbol.name })
            .replace(/[\u0591-\u05C7]/g, '')
            .toLowerCase()
            .split(' ');

        let filtered;

        for (let i = 0; i < words.length; i += 1) {
          filtered = words[i].slice(0, inputLength) === inputValue;
          if (filtered) { break; }
        }

        return filtered;
      }) : [];

    return suggestions;
  }

  handleSuggestionsFetchRequested({ value }) {
    const imageSuggestions = this.getSuggestions(value);
    this.setState({ imageSuggestions });
  }

  handleSuggestionsClearRequested() {
    this.setState({ imageSuggestions: [] });
  }

  handleImageSearchChange(event, { newValue }) {
    if (newValue !== event.target.value) {
      newValue = this.props.intl.formatMessage({ id: newValue });
    }
    this.setState({ imageSearchValue: newValue });
  }

  handleSuggestionSelected(event, { suggestion }) {
    this.setState({ img: suggestion.src, label: suggestion.name, text: '' });
  }

  handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (ev) => {
      const img = document.createElement('img');
      const width = 512;
      const height = 512;

      img.onload = (e) => {
        const imageData = this.getBase64Image(e.target, width, height);
        const dataURL = '' + imageData;
        this.setState({ img: dataURL });
      };
      img.src = ev.target.result;
    };

    reader.readAsDataURL(file);
  }

  handleLabelChange(event) {
    this.setState({ label: event.target.value });
  }

  handleTextChange(event) {
    this.setState({ text: event.target.value });
  }

  handleTypeChange(event) {
    this.setState({ type: event.target.checked });
  }

  handleLinkChange(event) {
    this.setState({ link: event.target.value });
  }

  handleSubmit() {
    const { type, label, text, img, link } = this.state;
    const button = {
      type: type ? 'link' : 'button',
      label,
      text,
      img,
      link,
    };
    this.props.onAdd(button);
  }

  render() {
    const addButtonClasses = classnames({ 'add-button': true });

    const { imageSearchValue, imageSuggestions } = this.state;

    // Autosuggest will pass through all these props to the input element.
    const inputProps = {
      placeholder: 'Search an image',
      value: imageSearchValue,
      onChange: this.handleImageSearchChange,
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
            ref={(autoSuggest) => { this.autoSuggest = autoSuggest; }}
          />
          <InputImage onChange={this.handleImageUpload} />
          <br />
          <TextField
            hintText="Symbol Label"
            onChange={this.handleLabelChange}
          />
          <br />
          <TextField
            hintText="TTS Text"
            onChange={this.handleTextChange}
          />
          <br />
          <Toggle
            label="Folder"
            labelPosition="right"
            onChange={this.handleTypeChange}
          />
          <br />
          {this.state.type && <TextField
            hintText="Board ID"
            defaultValue={this.state.link}
            onChange={this.handleLinkChange}
          />}
          <button className="add-button__submit" type="button" onClick={this.handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    );
  }
}

addButton.propTypes = {
  intl: PropTypes.object,
  onAdd: PropTypes.func.isRequired,
};

export default injectIntl(addButton);
