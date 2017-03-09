import React, { PureComponent, PropTypes } from 'react';
import classnames from 'classnames';
import Speech from 'speak-tts';

require('../../styles/App.css');

import Board from '../Board';
import Toggle from '../../components/Toggle';
import Switch from '../../components/Switch';
import boardApi from '../../api/boardApi';
import { translationMessages, appLocales, stripRegionCode, navigatorLanguage, normalizeLanguageCode } from '../../i18n';

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: props.defaultTab,
      boards: [],
      supportedVoices: [],
      selectedLanguage: navigatorLanguage
    };

    this.tabs = {
      SETTINGS: 'settings',
      BOARD: 'board',
      TEXT: 'text'
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

  setActiveTab(tab) {
    this.setState({ activeTab: tab });
  }

  render() {
    const { activeTab } = this.state;
    // todo DRY
    const tabs = Object.keys(this.tabs)
      .map(key => {
        return this.tabs[key];
      }).map((tab, index) => {
        switch (tab) {
          case this.tabs.SETTINGS:
            const settingsActive = classnames({ 'is-active': this.state.activeTab === this.tabs.SETTINGS, }, 'app__tab');
            return (
              <button key={index} onClick={event => { this.setActiveTab(tab) }} className={settingsActive}>
                <i className="material-icons">settings</i>
                Settings
                  </button>
            );
            break;
          case this.tabs.BOARD:
            const settingsClasses = classnames({ 'is-active': this.state.activeTab === this.tabs.BOARD, }, 'app__tab');
            return (
              <button key={index} onClick={event => { this.setActiveTab(tab) }} className={settingsClasses}>
                <i className="material-icons">view_module</i>
                Board
                  </button>
            );
            break;
          case this.tabs.TEXT:
            const textClasses = classnames({ 'is-active': this.state.activeTab === this.tabs.TEXT, }, 'app__tab');
            return (
              <button key={index} onClick={event => { this.setActiveTab(tab) }} className={textClasses}>
                <i className="material-icons">keyboard</i>
                Text
                  </button>
            );
            break;
        }
      });
    return (
      <div className="app">
        <div className="app__main">
          {activeTab === this.tabs.SETTINGS &&
            <div className="settings">
              <Toggle
                options={this.state.supportedVoices}
                value={this.state.selectedLanguage}
                onToggle={this.props.onLanguageToggle}
              />
            </div>}

          {activeTab === this.tabs.BOARD &&
            <Board
              messages={this.props.messages}
              boards={this.state.boards}
              onOutputChange={this.speak}
              onOutputClick={this.speak}
            />}
          {activeTab === this.tabs.TEXT &&
            <div className="text">
              <textarea ref={ref => { this.textarea = ref }}></textarea>
              <button className="mdc-button" onClick={() => { this.speak(this.textarea.value) }}>Speak</button>
            </div>
          }
        </div>
        <div className="app__tab-bar">
          {tabs}
        </div>

      </div>
    );
  }
}

App.propTypes = {
  language: PropTypes.string
};

App.defaultProps = {
  defaultTab: 'board',
  language: 'en-US'
};

export default App;
