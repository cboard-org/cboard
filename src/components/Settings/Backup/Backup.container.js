import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { importBoards } from '../../Board/Board.actions';
import { showNotification } from '../../Notifications/Notifications.actions';
import Backup from './Backup.component';

export class BackupContainer extends PureComponent {
  static propTypes = {
    boards: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired
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

  handleExportClick = () => {
    const exportFilename = 'board.json';
    const { boards } = this.props;
    const jsonData = new Blob([JSON.stringify(boards)], {
      type: 'text/json;charset=utf-8;'
    });

    // IE11 & Edge
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(jsonData, exportFilename);
    } else {
      // In FF link must be added to DOM to be clicked
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(jsonData);
      link.setAttribute('download', exportFilename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  render() {
    const { boards, history } = this.props;

    return (
      <Backup
        boards={boards}
        onExportClick={this.handleExportClick}
        onImportClick={this.handleImportClick}
        onRequestClose={history.goBack}
      />
    );
  }
}

const mapStateToProps = state => ({
  boards: state.board.boards
});

const mapDispatchToProps = {
  importBoards,
  showNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(BackupContainer);
