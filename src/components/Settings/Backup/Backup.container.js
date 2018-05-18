import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import { importBoards } from '../../Board/Board.actions';
import { showNotification } from '../../Notifications/Notifications.actions';
import Backup from './Backup.component';
import { EXPORT_CONFIG_BY_TYPE } from './Backup.constants';

const EXPORT_CONFIG_BY_TYPE = {
  cboard: {
    filename: 'board.json',
    fnName: null
  },
  openboard: {
    filename: 'board.obf',
    fnName: 'openboardExportAdapter'
  }
};

export class BackupContainer extends PureComponent {
  static propTypes = {
    boards: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    intl: intlShape.isRequired
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

  handleExportClick = (type = 'cboard') => {
    const exportConfig = EXPORT_CONFIG_BY_TYPE[type];
    if (!exportConfig) {
      return false;
    }

    const { boards, intl } = this.props;

    if (exportConfig.callback) {
      exportConfig.callback(boards, intl);
    } else {
      const jsonData = new Blob([JSON.stringify(boards)], {
        type: 'text/json;charset=utf-8;'
      });

      // IE11 & Edge
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(jsonData, exportConfig.filename);
      } else {
        // In FF link must be added to DOM to be clicked
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(jsonData);
        link.setAttribute('download', exportConfig.filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  openboardExportAdapter(boards) {
    return boards;
  }

  render() {
    const { boards, history } = this.props;

    return (
      <Backup
        boards={boards}
        onExportClick={this.handleExportClick}
        onImportClick={this.handleImportClick}
        onClose={history.goBack}
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

export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(BackupContainer)
);
