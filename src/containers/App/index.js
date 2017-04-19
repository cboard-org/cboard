import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Speech from 'speak-tts';
import { injectIntl, FormattedMessage } from 'react-intl';

require('../../styles/App.css');

import Board from '../Board';
import boardApi from '../../api/boardApi';
import { appLocales, stripRegionCode, navigatorLanguage, normalizeLanguageCode } from '../../i18n';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

const settingsIcon = <FontIcon className="material-icons">settings</FontIcon>;
const boardIcon = <FontIcon className="material-icons">view_module</FontIcon>;
const keyboardIcon = <FontIcon className="material-icons">keyboard</FontIcon>;

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
      return { value: lang, text };
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

  componentDidMount() {
    // DEBUG
    // fetch('/testPathMongo', {
    //   method: 'get'
    // }).then((response) => {
    //   console.log(response);
    // })
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
    const languageMenuItems = this.state.supportedVoices.map((voice, index) => {
      return <MenuItem key={index} value={voice.value} primaryText={voice.text} />;
    });

    return (
      <MuiThemeProvider>
        <div className="app">
          <div className="app__main">

            {selectedIndex === TABS.SETTINGS &&
              <div className="settings">
                <SelectField
                  floatingLabelText="Voices"
                  value={this.state.selectedLanguage}
                  onChange={this.props.onLanguageToggle}
                >
                  {languageMenuItems}
                </SelectField>
              </div>}

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
                  primary={true}
                  onClick={(event) => { event.preventDefault(); this.speak(this.textarea.value) }}
                />
              </div>}
          </div>

          <Paper zDepth={1}>
            <BottomNavigation selectedIndex={this.state.selectedIndex}>
              <BottomNavigationItem
                label={intl.formatMessage({ id: 'cboard.containers.App.bottomNavigationItem.settings' })}
                icon={settingsIcon}
                onTouchTap={() => this.select(TABS.SETTINGS)}
              />
              <BottomNavigationItem
                label={intl.formatMessage({ id: 'cboard.containers.App.bottomNavigationItem.board' })}
                icon={boardIcon}
                onTouchTap={() => this.select(TABS.BOARD)}
              />
              <BottomNavigationItem
                label={intl.formatMessage({ id: 'cboard.containers.App.bottomNavigationItem.keyboard' })}
                icon={keyboardIcon}
                onTouchTap={() => this.select(TABS.KEYBOARD)}
              />
            </BottomNavigation>
          </Paper>
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
