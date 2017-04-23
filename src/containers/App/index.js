import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Speech from 'speak-tts';

import { appLocales, stripRegionCode, navigatorLanguage, normalizeLanguageCode } from '../../i18n';
import boardApi from '../../api/boardApi';
import Board from '../../components/Board';
import NavigationBar from '../../components/NavigationBar';
import Settings from '../../components/Settings';
import Keyboard from '../../components/Keyboard';

require('../../styles/App.css');

const TABS = {
  SETTINGS: 0,
  BOARD: 1,
  KEYBOARD: 2,
};

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      boards: [],
      supportedVoices: [],
      selectedLanguage: navigatorLanguage,
      selectedIndex: TABS.BOARD,
    };

    this.select = this.select.bind(this);
    this.handleSpeak = this.handleSpeak.bind(this);
  }

  componentWillMount() {
    const boards = boardApi.getAllBoards();

    this.setState({ boards });
    function supportedVoice(voice) {
      for (let i = 0; i < appLocales.length; i += 1) {
        if (appLocales[i] === stripRegionCode(voice.lang)) {
          return true;
        }
      }
      return false;
    }

    function mapVoice(voice) {
      const name = voice.name;
      const lang = normalizeLanguageCode(voice.lang);
      const text = `${name} (${lang})`;

      return { lang, name, text };
    }

    Speech.init({
      lang: this.props.language,
      onVoicesLoaded: ({ voices }) => {
        const supportedVoices =
          voices
            .filter(supportedVoice)
            .map(mapVoice);
        this.setState({ supportedVoices });
      },
    });

    const supportedVoices =
      window.speechSynthesis.getVoices()
        .filter(supportedVoice)
        .map(mapVoice);
    this.setState({ supportedVoices });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.language !== nextProps.language) {
      const selectedLanguage = nextProps.language;
      this.setState({ selectedLanguage });
    }
  }

  speak(text, lang) {
    Speech.setLanguage(lang);
    Speech.speak({ text });
  }

  select(index) {
    this.setState({ selectedIndex: index });
  }

  handleSpeak(text) {
    this.speak(text, this.state.selectedLanguage);
  }

  render() {
    const intl = this.props.intl;
    const { selectedIndex } = this.state;
    const muiTheme = getMuiTheme({
      toolbar: {
        height: 56,
      },
      bottomNavigation: {
        backgroundColor: '#212121',
        selectedColor: '#fff',
        unselectedColor: '#aaa',
        selectedFontSize: 14,
        unselectedFontSize: 14,
      },

      isRtl: false,
    });

    return (
      <MuiThemeProvider muiTheme={muiTheme}>

        <div className="app">
          <div className="app__main">

            {selectedIndex === TABS.SETTINGS &&
              <Settings
                selectedLanguage={this.state.selectedLanguage}
                onLanguageToggle={this.props.onLanguageToggle}
                supportedVoices={this.state.supportedVoices}
              />}

            {selectedIndex === TABS.BOARD &&
              <Board
                messages={this.props.messages}
                boards={this.state.boards}
                onOutputChange={this.handleSpeak}
                onOutputClick={this.handleSpeak}
              />}

            {selectedIndex === TABS.KEYBOARD &&
              <Keyboard
                intl={intl}
                onSpeak={this.handleSpeak}
              />}
          </div>

          <NavigationBar
            selectedIndex={this.state.selectedIndex}
            intl={intl}
            select={this.select}
            TABS={TABS}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  language: PropTypes.string,
  messages: PropTypes.object,
  onLanguageToggle: PropTypes.func,
  intl: PropTypes.object,
};

App.defaultProps = {
  language: 'en-US',
  messages: {},
  onLanguageToggle: () => { },
  intl: {},
};

export default injectIntl(App);
