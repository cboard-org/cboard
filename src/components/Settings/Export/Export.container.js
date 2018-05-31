import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import { showNotification } from '../../Notifications/Notifications.actions';
import Export from './Export.component';
import { EXPORT_CONFIG_BY_TYPE } from './Export.constants';

export class ExportContainer extends PureComponent {
  static propTypes = {
    boards: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    intl: intlShape.isRequired
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(ExportContainer));
