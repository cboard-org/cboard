import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Autosuggest from 'react-autosuggest';
import TextField from 'material-ui/TextField';
import classNames from 'classnames';

import messages from './messages';
import mulberrySymbols from '../../../api/mulberry-symbols.json';
import './SymbolSearch.css';

let symbols = [];

function renderInput(inputProps) {
  const { home, value, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      autoFocus={home}
      value={value}
      inputRef={ref}
      InputProps={{
        ...other
      }}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  return (
    <div
      className={classNames(
        { 'SymbolSearch__Suggestion--highlighted': isHighlighted },
        'SymbolSearch__Suggestion'
      )}
    >
      <img
        className="SymbolSearch__Suggestion-img"
        src={suggestion.src}
        alt=""
      />
      <div>
        {suggestion.id}
      </div>
    </div>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <div {...containerProps}>
      {children}
    </div>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.id;
}

function getSuggestions(value) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return symbols.filter(symbol => {
    if (count >= 16) {
      return false;
    }

    let keep = symbol.id.slice(0, inputLength) === inputValue;

    if (!keep) {
      const words = symbol.id.split(' ');
      for (let i = 1; i < words.length; i += 1) {
        keep = words[i].slice(0, inputLength) === inputValue;
        if (keep) {
          break;
        }
      }
    }

    if (keep) {
      count += 1;
    }
    return keep;
  });
}

export class SymbolSearch extends Component {
  state = {
    value: '',
    suggestions: []
  };

  componentDidMount() {
    symbols = this.translateSymbols(mulberrySymbols);
  }

  translateSymbols(symbols) {
    return symbols.map(symbol => {
      const translatedId = this.props.intl
        .formatMessage({ id: symbol.id })
        .replace(/[\u0591-\u05C7]/g, '') // todo: not on every locale - strip hebrew niqqud
        .toLowerCase();

      return { ...symbol, id: translatedId };
    });
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleSuggestionSelected = (event, { suggestion }) => {
    const { onChange } = this.props;
    this.setState({ value: '' });

    onChange({
      img: suggestion.src,
      label: suggestion.id
    });
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  render() {
    const { intl } = this.props;

    return (
      <Autosuggest
        renderInputComponent={renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        onSuggestionSelected={this.handleSuggestionSelected}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        highlightFirstSuggestion={true}
        inputProps={{
          autoFocus: true,
          placeholder: intl.formatMessage(messages.searchAnImage),
          value: this.state.value,
          onChange: this.handleChange
        }}
      />
    );
  }
}

SymbolSearch.propTypes = {
  onChange: PropTypes.func.isRequired
};

SymbolSearch.defaultProps = {};

export default injectIntl(SymbolSearch);
