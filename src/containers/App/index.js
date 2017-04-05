import React, { PureComponent, PropTypes } from 'react';
import classnames from 'classnames';
import Speech from 'speak-tts';
import { injectIntl, FormattedMessage } from 'react-intl';
import {map as _map} from 'lodash';

require('../../styles/App.css');

import Board from '../Board';
import Toggle from '../../components/Toggle';
import Switch from '../../components/Switch';
import boardApi from '../../api/boardApi';
import { translationMessages, appLocales, stripRegionCode, navigatorLanguage, normalizeLanguageCode } from '../../i18n';

const TABS = {
    SETTINGS: 'settings',
    BOARD: 'board',
    TEXT: 'text',
  },
  TABS_TO_ICONS = {
    [TABS.SETTINGS]: 'settings',
    [TABS.BOARD]: 'view_module',
    [TABS.TEXT]: 'keyboard',
  };

function getTabButton(tab, activeTab, handleTabClick) {
  return (
    <button key={tab} onClick={handleTabClick(tab)} className={classnames('app__tab', {'is-active': activeTab === tab})} >
      <i className="material-icons">{TABS_TO_ICONS[tab]}</i>
      <FormattedMessage id={`cboard.containers.App.tabs.${tab}`} />
    </button>
  );
}

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: props.defaultTab,
      boards: [],
      supportedVoices: [],
      selectedLanguage: navigatorLanguage
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

  handleClickSpeak = (event) => {
    event.preventDefault();

  }

  setActiveTab(tab) {
    this.setState({ activeTab: tab });
  }

  handleTabClick = (tab) => () => {
    this.setActiveTab(tab);
  }

  render() {
    const { activeTab } = this.state,
      tabs = _map(TABS, (tab) => getTabButton(tab, activeTab, this.handleTabClick));

    return (
      <div className="app">
        <div className="app__main">
          {activeTab === TABS.SETTINGS &&
            <div className="settings">
              <Toggle
                options={this.state.supportedVoices}
                value={this.state.selectedLanguage}
                onToggle={this.props.onLanguageToggle}
              />
            </div>}

          {activeTab === TABS.BOARD &&
            <Board
              messages={this.props.messages}
              boards={this.state.boards}
              onOutputChange={this.speak}
              onOutputClick={this.speak}
            />}
          {activeTab === TABS.TEXT &&
            <div className="text">
              <textarea ref={ref => { this.textarea = ref }}></textarea>
              <button className="mdc-button" onClick={(event) => {event.preventDefault(); this.speak(this.textarea.value) }}><FormattedMessage id="cboard.containers.Text.speak" /></button>
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
