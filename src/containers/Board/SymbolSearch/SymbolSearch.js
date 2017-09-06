import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import Autosuggest from 'react-autosuggest';
import TextField from 'material-ui/TextField';
import classNames from 'classnames';

import messages from './messages';
import mulberrySymbols from '../../../api/mulberry-symbols.json';
import './SymbolSearch.css';

export class SymbolSearch extends Component {
  state = {
    value: '',
    suggestions: []
  };

  symbols = this.translateSymbols(mulberrySymbols);

  translateSymbols(symbols) {
    return symbols.map(symbol => {
      const translatedId = this.props.intl
        .formatMessage({ id: symbol.id })
        .replace(/[\u0591-\u05C7]/g, '') // todo: not on every locale - strip hebrew niqqud
        .toLowerCase();

      return { ...symbol, translatedId };
    });
  }

  getSuggestionValue(suggestion) {
    return suggestion.id;
  }

  getSuggestions(value) {
    const { maxSuggestions } = this.props;
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return this.symbols.filter(symbol => {
      if (count >= maxSuggestions) {
        return false;
      }
      const translatedId = symbol.translatedId;
      let keep = translatedId.slice(0, inputLength) === inputValue;

      if (!keep) {
        const words = translatedId.split(' ');

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

  renderInput(inputProps) {
    const { value, label, ref, ...other } = inputProps;

    return (
      <TextField
        fullWidth
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
    const suggestionClassName = classNames({
      SymbolSearch__Suggestion: true,
      'SymbolSearch__Suggestion--highlighted': isHighlighted
    });

    return (
      <div className={suggestionClassName}>
        <img
          className="SymbolSearch__Suggestion-img"
          src={suggestion.src}
          alt=""
        />
        <div>{suggestion.translatedId}</div>
      </div>
    );
  }

  renderSuggestionsContainer(options) {
    const { containerProps, children } = options;
    return <div {...containerProps}>{children}</div>;
  }

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
          placeholder: intl.formatMessage(messages.searchImageLibrary),
          label: intl.formatMessage(messages.searchImageLibrary),
          value: this.state.value,
          onChange: this.handleChange
        }}
      />
    );
  }
}

SymbolSearch.propTypes = {
  intl: intlShape.isRequired,
  maxSuggestions: PropTypes.number,
  onChange: PropTypes.func.isRequired
};

SymbolSearch.defaultProps = {
  maxSuggestions: 16
};

export default injectIntl(SymbolSearch);
