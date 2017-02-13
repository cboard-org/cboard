import React, { Component } from 'react';
import Speech from 'speak-tts';

require('../../styles/App.css');

import Board from '../Board';
import Toggle from '../../components/Toggle';
import boardApi from '../../api/boardApi';
import { translationMessages, appLocales, stripRegionCode } from '../../i18n';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { boards: [], edit: false, voices: [] };
  }

  componentWillMount() {
    const boards = boardApi.getAllBoards();
    this.setState({ boards });

    Speech.init({
      lang: this.props.locale,
      onVoicesLoaded: ({voices}) => {
        this.setState({ voices });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.locale !== nextProps.locale) {
      Speech.setLanguage(nextProps.locale);
    }
  }

  speak(text) {
    Speech.speak({ text });
  }

  onToggleEdit = (event) => {
    const edit = event.target.checked;
    this.setState({ edit });
  }

  render() {
    return (
      <div className="app">
        <div className="app__bar">
          <input className="toggle-edit" type="checkbox" value="edit" onChange={this.onToggleEdit} />
          <Toggle values={this.state.voices} onToggle={this.props.onLanguageToggle} />
        </div>

        <Board
          boards={this.state.boards}
          edit={this.state.edit}
          onOutputChange={this.speak}
          onOutputClick={this.speak} />
      </div>
    );
  }
}

App.propTypes = {
  locale: React.PropTypes.string
};

App.defaultProps = {
  locale: 'en'
};

export default App;
