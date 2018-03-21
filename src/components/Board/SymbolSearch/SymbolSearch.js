import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import Autosuggest from 'react-autosuggest';
import classNames from 'classnames';
import isMobile from 'ismobilejs';

import messages from './SymbolSearch.messages';
import mulberrySymbols from '../../../api/mulberry-symbols.json';
import FullScreenDialog from '../../UI/FullScreenDialog';
import Symbol from '../Symbol';
import './SymbolSearch.css';

export class SymbolSearch extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    open: PropTypes.bool,
    maxSuggestions: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired
  };

  static defaultProps = {
    open: false,
    maxSuggestions: 16
  };

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
    const { onChange, onRequestClose } = this.props;
    this.setState({ value: '' });

    onChange({
      img: suggestion.src,
      labelKey: suggestion.id
    });
    onRequestClose();
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  renderSuggestion(suggestion, { query, isHighlighted }) {
    const suggestionClassName = classNames('SymbolSearch__Suggestion', {
      'SymbolSearch__Suggestion--highlighted': isHighlighted
    });

    return (
      <div className={suggestionClassName}>
        <Symbol label={suggestion.translatedId} img={suggestion.src} />
      </div>
    );
  }

  renderSuggestionsContainer(options) {
    const { containerProps, children } = options;
    return <div {...containerProps}>{children}</div>;
  }

  render() {
    const { intl, open, onRequestClose } = this.props;

    const autoSuggest = (
      <Autosuggest
        aria-label="Search auto-suggest"
        suggestions={this.state.suggestions}
        focusInputOnSuggestionClick={!isMobile.any}
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

    return (
      <FullScreenDialog
        open={open}
        buttons={autoSuggest}
        transition="fade"
        onRequestClose={onRequestClose}
      />
    );
  }
}

export default injectIntl(SymbolSearch);
