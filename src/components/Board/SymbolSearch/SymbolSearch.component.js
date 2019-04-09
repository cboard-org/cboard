import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import Autosuggest from 'react-autosuggest';
import classNames from 'classnames';
import isMobile from 'ismobilejs';
import queryString from 'query-string';

import FullScreenDialog from '../../UI/FullScreenDialog';
import Symbol from '../Symbol';
import messages from './SymbolSearch.messages';
import './SymbolSearch.css';
import API from '../../../api';
import { ARASAAC_BASE_PATH_API } from '../../../constants';

export class SymbolSearch extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    open: PropTypes.bool,
    maxSuggestions: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  };

  static defaultProps = {
    open: false,
    maxSuggestions: 16
  };

  state = {
    value: '',
    suggestions: [],
    skin: undefined,
    hair: undefined
  };

  symbols = [];

  async componentDidMount() {
    const {
      intl: { locale }
    } = this.props;
    try {
      const languagesResponse = await API.getLanguage(`${locale}-`);
      const { skin, hair } = languagesResponse;
      if (skin && hair) await this.setState({ skin, hair });
    } catch (err) {}

    import('../../../api/mulberry-symbols.json').then(
      ({ default: mulberrySymbols }) => {
        this.symbols = this.translateSymbols(mulberrySymbols);
      }
    );
  }

  translateSymbols(symbols = []) {
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

  fetchSrasaacSuggestions = async searchText => {
    const {
      intl: { locale }
    } = this.props;
    const { skin, hair } = this.state;
    try {
      const data = await API.arasaacPictogramsSearch(locale, searchText);
      console.log(data);
      if (data.length) {
        return data.map(({ idPictogram, keywords: [keyword] }) => {
          return {
            id: keyword.keyword,
            src: `${ARASAAC_BASE_PATH_API}pictograms/${idPictogram}?${queryString.stringify(
              { skin, hair }
            )}`,
            translatedId: keyword.keyword
          };
        });
      }
      return [];
    } catch (err) {
      return [];
    }
  };

  fetchTawasolSuggestions = async searchText => {
    const {
      intl: { locale }
    } = this.props;
    const { skin, hair } = this.state;
    try {
      const data = await API.tawasolPictogramsSearch(searchText);
      if (data.length) {
        return data
          .filter(el => el.source_id === '1')
          .map(({ idPictogram, keywords: [keyword] }) => {
            return {
              id: keyword.keyword,
              src: `${ARASAAC_BASE_PATH_API}pictograms/${idPictogram}?${queryString.stringify(
                { skin, hair }
              )}`,
              translatedId: keyword.keyword
            };
          });
      }
      return [];
    } catch (err) {
      return [];
    }
  };

  handleSuggestionsFetchRequested = async ({ value }) => {
    const localSuggestions = this.getSuggestions(value);
    const srasaacSuggestions = await this.fetchSrasaacSuggestions(value);
    console.log(srasaacSuggestions);
    if (window.navigator.language.slice(0, 2) === 'ar') {
      const tawasolSuggestions = await this.fetchTawasolSuggestions(value);
      this.setState({
        suggestions: [
          ...tawasolSuggestions,
          ...localSuggestions,
          ...srasaacSuggestions
        ]
      });
    } else {
      this.setState({
        suggestions: [...localSuggestions, ...srasaacSuggestions]
      });
    }
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleSuggestionSelected = (event, { suggestion }) => {
    const { onChange, onClose } = this.props;
    this.setState({ value: '' });

    onChange({
      image: suggestion.src,
      label: suggestion.translatedId,
      labelKey: suggestion.id
    });
    onClose();
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
        <Symbol label={suggestion.translatedId} image={suggestion.src} />
      </div>
    );
  }

  renderSuggestionsContainer(options) {
    const { containerProps, children } = options;
    return <div {...containerProps}>{children}</div>;
  }

  render() {
    const { intl, open, onClose } = this.props;

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
          placeholder: intl.formatMessage(messages.searchSymbolLibrary),
          label: intl.formatMessage(messages.searchSymbolLibrary),
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
        onClose={onClose}
      />
    );
  }
}

export default injectIntl(SymbolSearch);
