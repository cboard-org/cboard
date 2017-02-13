import React, { Component } from 'react';

require('../../styles/App.css');

import Board from '../Board';
import boardApi from '../../api/boardApi';
import Speech from 'speak-tts';
import { translationMessages, appLocales } from '../../i18n';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { boards: [], edit: false, voices: [] };
  }

  componentWillMount() {
    const boards = boardApi.getAllBoards();
    this.setState({ boards });

    Speech.init({
      lang: this.props.lang,
      onVoicesLoaded: (data) => {
        this.setState({ voices: data.voices });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.lang !== nextProps.lang) {
      Speech.setLanguage(nextProps.lang);
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
  lang: React.PropTypes.string
};

App.defaultProps = {
  lang: 'en-US'
};

export default App;
