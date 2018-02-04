import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Settings from './Settings.component';
import { importBoards } from '../Board/Board.actions';
import { showNotification } from '../Notifications/Notifications.actions';

export class SettingsContainer extends Component {
  static propTypes = {
    lang: PropTypes.string,
    boards: PropTypes.array,
    children: PropTypes.node,
    className: PropTypes.string
  };

  state = {
    languageOpen: false,
    speechOpen: false,
    backupOpen: false,
    aboutOpen: false
  };

  handleGoBackClick = () => {
    this.setState({
      languageOpen: false,
      speechOpen: false,
      backupOpen: false,
      aboutOpen: false
    });
  };

  handleLanguageClick = () => {
    this.setState({ languageOpen: true });
  };

  handleSpeechClick = () => {
    this.setState({ speechOpen: true });
  };

  handleBackupClick = () => {
    this.setState({ backupOpen: true });
  };

  handleAboutClick = () => {
    this.setState({ aboutOpen: true });
  };

  handleFeedbackClick = () => {
    window.location.href = 'mailto:shayc@outlook.com?subject=Cboard feedback';
  };

  handleImportClick = e => {
    const { importBoards, showNotification } = this.props;

    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      if (e.target.files.length > 0) {
        const file = e.target.files[0];
        const ext = file.name.match(/\.([^.]+)$/)[1];
        if (ext === 'json') {
          // TODO. Json format validation
          const reader = new FileReader();
          reader.onload = event => {
            if (event.target.readyState === 2) {
              try {
                const jsonFile = JSON.parse(reader.result);
                importBoards(jsonFile);
                showNotification('Backup restored successfuly.');
              } catch (err) {
                console.error(err);
              }
            }
          };
          reader.readAsText(file);
        } else {
          alert('Please, select JSON file.');
        }
      } else {
        console.warn('There is no selected file.');
      }
    } else {
      console.warn('The File APIs are not fully supported in this browser.');
    }
  };

  render() {
    const { boards, history, lang } = this.props;

    return (
      <Settings
        boards={boards}
        lang={lang}
        aboutOpen={this.state.aboutOpen}
        backupOpen={this.state.backupOpen}
        languageOpen={this.state.languageOpen}
        speechOpen={this.state.speechOpen}
        onAboutClick={this.handleAboutClick}
        onBackupClick={this.handleBackupClick}
        onGoBackClick={this.handleGoBackClick}
        onImportClick={this.handleImportClick}
        onLanguageClick={this.handleLanguageClick}
        onSpeechClick={this.handleSpeechClick}
        onFeedbackClick={this.handleFeedbackClick}
        onRequestClose={history.goBack}
      />
    );
  }
}

const mapStateToProps = state => ({
  lang: state.language.lang,
  boards: state.board.boards
});

const mapDispatchToProps = {
  importBoards,
  showNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
