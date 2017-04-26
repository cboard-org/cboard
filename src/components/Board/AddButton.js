import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import Autosuggest from 'react-autosuggest';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

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

const customContentStyle = {
  width: '100%',
  maxWidth: 'none',
};

class addButton extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open: props.open,
      imageSearchValue: '',
      imageSuggestions: [],
      type: '',
      img: '',
      label: '',
      text: '',
      link: '',
    };
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    if (this.state.open !== nextProps.open) {
      this.setState({ open: nextProps.open });
    }
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

  handleSuggestionsFetchRequested = ({ value }) => {
    const imageSuggestions = this.getSuggestions(value);
    this.setState({ imageSuggestions });
  }

  handleSuggestionsClearRequested = () => {
    this.setState({ imageSuggestions: [] });
  }

  handleImageSearchChange = (event, { newValue }) => {
    if (newValue !== event.target.value) {
      newValue = this.props.intl.formatMessage({ id: newValue });
    }
    this.setState({ imageSearchValue: newValue });
  }

  handleSuggestionSelected = (event, { suggestion }) => {
    this.setState({
      img: suggestion.src,
      label: suggestion.name,
      imageSearchValue: '',
    });
  }

  handleImageUpload = (imageData) => {
    this.setState({ img: imageData });
  }

  handleLabelChange = (event) => {
    this.setState({ label: event.target.value });
  }

  handleTextChange = (event) => {
    this.setState({ text: event.target.value });
  }

  handleTypeChange = (event) => {
    this.setState({ type: event.target.checked });
  }

  handleLinkChange = (event) => {
    this.setState({ link: event.target.value });
  }

  handleClose = () => {
    this.setState({ open: false });
    this.props.onClose();
  }

  handleSubmit = () => {
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
    const { imageSearchValue, imageSuggestions, img } = this.state;

    // Autosuggest will pass through all these props to the input element.
    const inputProps = {
      placeholder: 'Search an image',
      value: imageSearchValue,
      onChange: this.handleImageSearchChange,
    };

    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary
        onTouchTap={this.handleSubmit}
      />,
    ];

    return (
      <Dialog
        title="Add new symbol"
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose}
        autoScrollBodyContent
        contentStyle={customContentStyle}
      >
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
          <div className="image-placeholder">
            <img src={this.state.img} alt="" />
          </div>
          <InputImage onChange={this.handleImageUpload} />
          <br />
          <TextField
            floatingLabelText="Label"
            value={this.state.label}
            onChange={this.handleLabelChange}
          />
          <br />
          <TextField
            floatingLabelText="TTS Text"
            onChange={this.handleTextChange}
          />
          <br />
          <Toggle
            label="Folder"
            labelPosition="right"
            onToggle={this.handleTypeChange}
          />
          <br />
          {this.state.type && <TextField
            hintText="Board ID"
            defaultValue={this.state.link}
            onChange={this.handleLinkChange}
          />}
        </form>
      </Dialog>
    );
  }
}

addButton.propTypes = {
  intl: PropTypes.object,
  open: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default injectIntl(addButton);
