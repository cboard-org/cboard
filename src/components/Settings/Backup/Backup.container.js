import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Backup from './Backup.component';

export class BackupContainer extends PureComponent {
  static propTypes = {
    boards: PropTypes.array.isRequired,
    open: PropTypes.bool,

    onImportClick: PropTypes.func,
    onRequestClose: PropTypes.func
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
    const { open, onRequestClose, onImportClick } = this.props;

    return (
      <Backup
        open={open}
        onExportClick={this.handleExportClick}
        onImportClick={onImportClick}
        onRequestClose={onRequestClose}
      />
    );
  }
}

export default BackupContainer;
