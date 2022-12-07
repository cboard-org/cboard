import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import Autosuggest from 'react-autosuggest';
import classNames from 'classnames';
import isMobile from 'ismobilejs';
import queryString from 'query-string';
import debounce from 'lodash/debounce';

import API from '../../../api';
import { ARASAAC_BASE_PATH_API } from '../../../constants';
import FullScreenDialog from '../../UI/FullScreenDialog';
import FilterBar from '../../UI/FilterBar';
import Symbol from '../Symbol';
import { LABEL_POSITION_BELOW } from '../../Settings/Display/Display.constants';
import messages from './SymbolSearch.messages';
import './SymbolSearch.css';
import { IconButton, Tooltip } from '@material-ui/core';
import BackspaceIcon from '@material-ui/icons/Backspace';

const SymbolSets = {
  mulberry: '0',
  global: '1',
  arasaac: '2'
};

const symbolSetsOptions = [
  {
    id: SymbolSets.mulberry,
    text: 'Mulberry',
    enabled: true
  },
  {
    id: SymbolSets.global,
    text: 'Global Symbols',
    enabled: true
  },
  {
    id: SymbolSets.arasaac,
    text: 'ARASAAC',
    enabled: true
  }
];

export class SymbolSearch extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    open: PropTypes.bool,
    autoFill: PropTypes.string,
    maxSuggestions: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  };

  static defaultProps = {
    open: false,
    maxSuggestions: 16
  };

  constructor(props) {
    super(props);
    this.state = {
      openMirror: false,
      value: '',
      suggestions: [],
      skin: 'white',
      hair: 'brown',
      symbolSets: symbolSetsOptions
    };

    this.symbols = [];
  }

  async componentDidMount() {
    import('../../../api/mulberry-symbols.json').then(
      ({ default: mulberrySymbols }) => {
        this.symbols = this.translateSymbols(mulberrySymbols);
      }
    );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { open, autoFill } = nextProps;
    const { openMirror: wasOpen } = prevState;

    if (open === true && wasOpen === false)
      return { value: autoFill, openMirror: true };
    if (open === false) return { openMirror: false };
    return null;
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

  getMulberrySuggestions(value) {
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

  fetchArasaacSuggestions = async searchText => {
    const {
      intl: { locale }
    } = this.props;
    const { skin, hair } = this.state;
    if (!searchText) {
      return [];
    }
    try {
      const data = await API.arasaacPictogramsSearch(locale, searchText);
      if (data.length) {
        const suggestions = [
          ...this.state.suggestions.filter(
            suggestion => !suggestion.fromArasaac
          )
        ];
        const arasaacSuggestions = data.map(
          ({ _id: idPictogram, keywords: [keyword] }) => {
            return {
              id: keyword.keyword,
              src: `${ARASAAC_BASE_PATH_API}pictograms/${idPictogram}?${queryString.stringify(
                { skin, hair }
              )}`,
              translatedId: keyword.keyword,
              fromArasaac: true
            };
          }
        );
        this.setState({ suggestions: [...suggestions, ...arasaacSuggestions] });
      }
      return [];
    } catch (err) {
      return [];
    }
  };

  fetchGlobalsymbolsSuggestions = async searchText => {
    const {
      intl: { locale }
    } = this.props;
    try {
      let language = locale !== 'me' ? locale : 'cnr';
      const data = await API.globalsymbolsPictogramsSearch(
        language,
        searchText
      );
      if (data.length) {
        const suggestions = [
          ...this.state.suggestions.filter(
            suggestion => !suggestion.fromGlobalsymbols
          )
        ];
        let globalsymbolsSuggestions = [];
        data.forEach(function(element) {
          globalsymbolsSuggestions.push({
            id: element.text,
            src: element.picto.image_url,
            translatedId: element.text,
            fromGlobalsymbols: true
          });
        });
        this.setState({
          suggestions: [...suggestions, ...globalsymbolsSuggestions]
        });
      }
      return [];
    } catch (err) {
      return [];
    }
  };

  getSuggestions(value) {
    this.setState({
      suggestions: []
    });
    if (this.state.symbolSets[SymbolSets.global].enabled) {
      this.fetchGlobalsymbolsSuggestions(value);
    }
    if (this.state.symbolSets[SymbolSets.arasaac].enabled) {
      this.fetchArasaacSuggestions(value);
    }
    if (this.state.symbolSets[SymbolSets.mulberry].enabled) {
      this.setState({
        suggestions: this.getMulberrySuggestions(value)
      });
    }
  }

  debouncedGetSuggestions = debounce(this.getSuggestions, 300);

  handleSuggestionsFetchRequested = async ({ value }) => {
    this.debouncedGetSuggestions(value);
  };

  handleSuggestionsClearRequested = () => {};

  handleSuggestionSelected = async (event, { suggestion }) => {
    const { onChange, onClose, autoFill } = this.props;
    this.setState({ value: '' });

    const label = autoFill.length ? autoFill : suggestion.translatedId;
    const fetchArasaacImageUrl = async () => {
      const suggestionImageReq = `${suggestion.src}&url=true`;
      return await API.arasaacPictogramsGetImageUrl(suggestionImageReq);
    };
    const symbolImage = suggestion.fromArasaac
      ? await fetchArasaacImageUrl()
      : suggestion.src;

    onChange({
      image: symbolImage,
      label: label,
      labelKey: undefined
    }).then(() => onClose());
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
        <Symbol
          label={suggestion.translatedId}
          image={suggestion.src}
          labelpos={LABEL_POSITION_BELOW}
        />
      </div>
    );
  }

  renderSuggestionsContainer(options) {
    const { containerProps, children } = options;
    return <div {...containerProps}>{children}</div>;
  }

  handleChangeOption = opt => {
    const newSymbolSets = this.state.symbolSets.map(option => {
      if (option.id === opt.id) {
        option.enabled = !option.enabled;
      }
      return option;
    });
    this.setState({
      symbolSets: newSymbolSets
    });
    this.getSuggestions(this.state.value);
  };

  handleClearSuggest() {
    this.setState({ value: '' });
  }

  render() {
    const { intl, open, onClose } = this.props;

    const clearButton =
      this.state.value.length > 0 ? (
        <div className="react-autosuggest__clear">
          <Tooltip
            title={intl.formatMessage(messages.clearText)}
            aria-label={intl.formatMessage(messages.clearText)}
          >
            <IconButton
              label={intl.formatMessage(messages.clearText)}
              onClick={this.handleClearSuggest.bind(this)}
            >
              <BackspaceIcon style={{ color: 'white' }} />
            </IconButton>
          </Tooltip>
        </div>
      ) : null;

    const autoSuggest = (
      <div className="react-autosuggest__container">
        <Autosuggest
          aria-label="Search auto-suggest"
          alwaysRenderSuggestions={true}
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
        {clearButton}
      </div>
    );

    return (
      <div>
        <FullScreenDialog
          open={open}
          buttons={autoSuggest}
          transition="fade"
          onClose={onClose}
        >
          <FilterBar
            options={this.state.symbolSets}
            onChange={this.handleChangeOption}
          />
        </FullScreenDialog>
      </div>
    );
  }
}

export default injectIntl(SymbolSearch);
