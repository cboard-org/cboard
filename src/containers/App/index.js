import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Speech from 'speak-tts';
import { injectIntl } from 'react-intl';

require('../../styles/App.css');

import { appLocales, stripRegionCode, navigatorLanguage, normalizeLanguageCode } from '../../i18n';

import Board from '../Board';
import boardApi from '../../api/boardApi';

import NavigationBar from '../../components/NavigationBar';
import Settings from '../../components/Settings';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';

import RaisedButton from 'material-ui/RaisedButton';

const volumeUpIcon = <FontIcon className="material-icons">volume_up</FontIcon>;

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
      selectedIndex: TABS.BOARD
    };
  }

  componentWillMount() {
    const boards = boardApi.getAllBoards();

    this.setState({ boards });
    function supportedVoice(voice) {
      for (let i = 0; i < appLocales.length; i++) {
        if (appLocales[i] === stripRegionCode(voice.lang)) {
          return true;
        }
      }
      return false;
    }

    function mapVoice(voice) {
      let { name, lang } = voice;
      lang = normalizeLanguageCode(lang);
      const text = `${name} (${lang})`;

      return { lang, name, text };
    }

    Speech.init({
      lang: this.props.language,
      onVoicesLoaded: ({ voices }) => {
        let supportedVoices =
          voices
            .filter(supportedVoice)
            .map(mapVoice);
        this.setState({ supportedVoices });
      }
    });

    let supportedVoices =
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

  speak = text => {
    Speech.setLanguage(this.state.selectedLanguage);
    Speech.speak({ text });
  }

  select = index => this.setState({ selectedIndex: index });

  render() {
    const intl = this.props.intl;
    const { selectedIndex } = this.state;

    return (
      <MuiThemeProvider>
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
                onOutputChange={this.speak}
                onOutputClick={this.speak}
              />}

            {selectedIndex === TABS.KEYBOARD &&
              <div className="keyboard">
                <textarea ref={ref => { this.textarea = ref }} placeholder="Type some text"></textarea>
                <RaisedButton
                  label={intl.formatMessage({ id: 'cboard.containers.Text.speak' })}
                  labelPosition="before"
                  icon={volumeUpIcon}
                  primary={true}
                  onTouchTap={(event) => { event.preventDefault(); this.speak(this.textarea.value) }}
                />
              </div>}
          </div>

          <NavigationBar
              selectedIndex={this.state.selectedIndex}
              intl={this.props.intl}
              select={this.select}
              TABS={TABS}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  language: PropTypes.string
};

App.defaultProps = {
  language: 'en-US'
};

export default injectIntl(App);
