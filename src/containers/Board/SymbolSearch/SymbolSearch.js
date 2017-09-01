import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Autosuggest from 'react-autosuggest';
import TextField from 'material-ui/TextField';
import classNames from 'classnames';

import messages from './messages';
import mulberrySymbols from '../../../api/mulberry-symbols.json';
import './SymbolSearch.css';

export class SymbolSearch extends Component {
  state = {
    value: '',
    suggestions: [],
    symbols: []
  };

  render() {
    const { intl } = this.props;
    return (
      <Autosuggest
        renderInputComponent={this.renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        onSuggestionSelected={this.handleSuggestionSelected}
        renderSuggestionsContainer={this.renderSuggestionsContainer}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        highlightFirstSuggestion={true}
        inputProps={{
          autoFocus: true,
          placeholder: intl.formatMessage(messages.searchAnImage),
          label: intl.formatMessage(messages.searchAnImage),
          value: this.state.value,
          onChange: this.handleChange,
        }}
      />
    );
  }

  componentDidMount() {
    this.setState({
      symbols: this.translateSymbols(mulberrySymbols)
    });
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

  renderInput(inputProps) {
    const { home, value, label, ref, ...other } = inputProps;

    return (
      <TextField
        fullWidth
        autoFocus={home}
        value={value}
        label={label}
        inputRef={ref}
        InputProps={{
          ...other
        }}
      />
    );
  }

  renderSuggestion(suggestion, { query, isHighlighted }) {
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

  renderSuggestionsContainer(options) {
    const { containerProps, children } = options;

    return (
      <div {...containerProps}>
        {children}
      </div>
    );
  }

  getSuggestionValue(suggestion) {
    return suggestion.id;
  }

  getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    let symbols = [...this.state.symbols];
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

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
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
}

SymbolSearch.propTypes = {
  onChange: PropTypes.func.isRequired
};

SymbolSearch.defaultProps = {};

export default injectIntl(SymbolSearch);
