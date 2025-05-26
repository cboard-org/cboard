import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import Autosuggest from 'react-autosuggest';
import classNames from 'classnames';
import isMobile from 'ismobilejs';
import queryString from 'query-string';
import debounce from 'lodash/debounce';
import { IconButton, Tooltip } from '@material-ui/core';
import BackspaceIcon from '@material-ui/icons/Backspace';

import API from '../../../api';
import { ARASAAC_BASE_PATH_API } from '../../../constants';
import { getArasaacDB } from '../../../idb/arasaac/arasaacdb';
import FullScreenDialog from '../../UI/FullScreenDialog';
import FilterBar from '../../UI/FilterBar';
import Symbol from '../Symbol';
import { LABEL_POSITION_BELOW } from '../../Settings/Display/Display.constants';
import messages from './SymbolSearch.messages';
import './SymbolSearch.css';
import SymbolNotFound from './SymbolNotFound';
import SkinToneSelect from '../../UI/ColorSelect/SkinToneSelect';
import HairColorSelect from '../../UI/ColorSelect/HairColorSelect';

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

const defaultSkin = 'white';
const defaultHair = 'brown';

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
    maxSuggestions: 16,
    autoFill: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      openMirror: false,
      isFetchingArasaac: false,
      isFetchingGlobalsymbols: false,
      value: '',
      suggestions: [],
      skin: defaultSkin,
      hair: defaultHair,
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

  get showInclusivityOptions() {
    return this.state.symbolSets.some(
      opt => opt.id === SymbolSets.arasaac && opt.enabled
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
    if (!searchText) {
      return [];
    }
    try {
      this.setState({
        isFetchingArasaac: true
      });
      const arasaacDB = await getArasaacDB();
      const imagesFromDB = await arasaacDB.getImagesByKeyword(
        searchText.trim()
      );
      if (imagesFromDB.length) {
        const suggestions = [
          ...this.state.suggestions.filter(
            suggestion => !suggestion.fromArasaac
          )
        ];
        const arasaacSuggestions = imagesFromDB.map(({ src, label, id }) => {
          return {
            id,
            src: `${ARASAAC_BASE_PATH_API}pictograms/${id}?${queryString.stringify(
              {
                skin: this.state.skin,
                hair: this.state.hair
              }
            )}`,
            keyPath: id,
            translatedId: label,
            fromArasaac: true
          };
        });
        this.setState({
          suggestions: [...suggestions, ...arasaacSuggestions],
          isFetchingArasaac: false
        });
      } else {
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
                  {
                    skin: this.state.skin,
                    hair: this.state.hair
                  }
                )}`,
                translatedId: keyword.keyword,
                fromArasaac: true
              };
            }
          );
          this.setState({
            suggestions: [...suggestions, ...arasaacSuggestions],
            isFetchingArasaac: false
          });
        }
      }

      return [];
    } catch (err) {
      return [];
    } finally {
      this.setState({
        isFetchingArasaac: false
      });
    }
  };

  fetchGlobalsymbolsSuggestions = async searchText => {
    const {
      intl: { locale }
    } = this.props;
    try {
      let language = locale !== 'me' ? locale : 'cnr';
      this.setState({
        isFetchingGlobalsymbols: true
      });
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
          const fixEspecialCharacters = text => {
            if (!text) return '';
            const utf8String = text
              .replace(/Ã¡/g, '\u00E1') // Replace á
              .replace(/Ã©/g, '\u00E9') // Replace é
              .replace(/Ã­/g, '\u00ED') // Replace í
              .replace(/Ã³/g, '\u00F3') // Replace ó
              .replace(/Ãº/g, '\u00FA') // Replace ú
              .replace(/Ã±/g, '\u00F1') // Replace ñ
              .replace(/Ã‘/g, '\u00D1') // Replace Ñ
              .replace(/Ã€/g, '\u00C0') // Replace À
              .replace(/Ãˆ/g, '\u00C8') // Replace È
              .replace(/ÃŒ/g, '\u00CC') // Replace Ì
              .replace(/Ã’/g, '\u00D2') // Replace Ò
              .replace(/Ã™/g, '\u00D9') // Replace Ù
              .replace(/Ã¤/g, '\u00E4') // Replace ä
              .replace(/Ã«/g, '\u00EB') // Replace ë
              .replace(/Ã¯/g, '\u00EF') // Replace ï
              .replace(/Ã¶/g, '\u00F6') // Replace ö
              .replace(/Ã¼/g, '\u00FC') // Replace ü
              .replace(/Ã„/g, '\u00C4') // Replace Ä
              .replace(/Ã‹/g, '\u00CB') // Replace Ë
              .replace(/Ã�/g, '\u00CF') // Replace Ï
              .replace(/Ã–/g, '\u00D6') // Replace Ö
              .replace(/Ãœ/g, '\u00DC'); // Replace Ü

            return utf8String;
          };
          const symbolText = fixEspecialCharacters(element.text);
          globalsymbolsSuggestions.push({
            id: symbolText,
            src: element.picto.image_url,
            translatedId: symbolText,
            fromGlobalsymbols: true
          });
        });
        this.setState({
          suggestions: [...suggestions, ...globalsymbolsSuggestions],
          isFetchingGlobalsymbols: false
        });
      }
      return [];
    } catch (err) {
      return [];
    } finally {
      this.setState({
        isFetchingGlobalsymbols: false
      });
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

  handleSuggestionsFetchRequested = async ({ value, reason }) => {
    if (reason === 'suggestion-selected') return;
    this.debouncedGetSuggestions(value);
  };

  handleSuggestionsClearRequested = () => {};

  handleSuggestionSelected = async (event, { suggestion }) => {
    const { onChange, onClose, autoFill } = this.props;
    this.setState({ value: '' });

    const label = autoFill.length ? autoFill : suggestion.translatedId;

    const fetchArasaacImageUrl = async () => {
      const suggestionImageReq = `${suggestion.src}&url=true`;
      const imageArasaacUrl = await API.arasaacPictogramsGetImageUrl(
        suggestionImageReq
      );

      // return static url when cannot retrive the image from arasaac server
      if (!imageArasaacUrl.length && suggestion.keyPath)
        return `https://static.arasaac.org/pictograms/${suggestion.keyPath}/${
          suggestion.keyPath
        }_500.png`;

      return imageArasaacUrl.length ? imageArasaacUrl : suggestion.src;
    };

    const symbolImage = suggestion.fromArasaac
      ? await fetchArasaacImageUrl()
      : suggestion.src;

    const keyPath = suggestion.keyPath ? suggestion.keyPath : undefined;

    onChange({
      image: symbolImage,
      keyPath: keyPath,
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
          keyPath={suggestion.keyPath}
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

  handleSkinToneChange = event => {
    const newSkin = event ? event.target.value : defaultSkin;
    this.setState({
      skin: newSkin
    });
    this.getSuggestions(this.state.value);
  };

  handleHairColorChange = event => {
    const newHair = event ? event.target.value : defaultHair;
    this.setState({
      hair: newHair
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
      <div
        className={`react-autosuggest__container ${
          this.showInclusivityOptions ? 'more-options' : ''
        }`}
      >
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
    const symbolNotFound =
      !this.state.isFetchingArasaac &&
      !this.state.isFetchingGlobalsymbols &&
      this.state.value.trim() !== '' &&
      this.state.suggestions.length === 0 ? (
        <SymbolNotFound />
      ) : null;
    const inclusivityOptions = this.showInclusivityOptions ? (
      <div class="filter-options-item ">
        <SkinToneSelect
          selectedColor={this.state.skin}
          onChange={this.handleSkinToneChange}
        />
        <HairColorSelect
          selectedColor={this.state.hair}
          onChange={this.handleHairColorChange}
        />
      </div>
    ) : null;
    const symbolSetOptions = (
      <div class="filter-options-item">
        <FilterBar
          options={this.state.symbolSets}
          onChange={this.handleChangeOption}
        />
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
          <div class="filter-options">
            {inclusivityOptions}
            {symbolSetOptions}
          </div>
          {symbolNotFound}
        </FullScreenDialog>
      </div>
    );
  }
}

export default injectIntl(SymbolSearch);
