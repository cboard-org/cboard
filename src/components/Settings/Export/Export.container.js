import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { showNotification } from '../../Notifications/Notifications.actions';
import Export from './Export.component';

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

export class ExportContainer extends PureComponent {
  static propTypes = {
    boards: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired
  };

  handleExportClick = (type = 'cboard') => {
    const exportConfig = EXPORT_CONFIG_BY_TYPE[type];
    if (!exportConfig) {
      return false;
    }

    const { boards } = this.props;

    const jsonBoards = exportConfig.fnName
      ? this[exportConfig.fnName](boards)
      : boards;

    const jsonData = new Blob([JSON.stringify(jsonBoards)], {
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
  };

  openboardExportAdapter(boards) {
    return boards;
  }

  render() {
    const { boards, history } = this.props;

    return (
      <Export
        boards={boards}
        onExportClick={this.handleExportClick}
        onClose={history.goBack}
      />
    );
  }
}

const mapStateToProps = state => ({
  boards: state.board.boards
});

const mapDispatchToProps = {
  showNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(ExportContainer);
