import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import { showNotification } from '../../Notifications/Notifications.actions';
import Export from './Export.component';
import { EXPORT_CONFIG_BY_TYPE } from './Export.constants';
import messages from './Export.messages';
import { isCordova } from '../../../cordova-util';

export class ExportContainer extends PureComponent {
  static propTypes = {
    boards: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    intl: intlShape.isRequired
  };

  handleExportClick = async (type = 'cboard', doneCallback) => {
    const exportConfig = EXPORT_CONFIG_BY_TYPE[type];
    const EXPORT_HELPERS = await import('./Export.helpers');

    if (
      !exportConfig ||
      !exportConfig.callback ||
      !EXPORT_HELPERS[exportConfig.callback]
    ) {
      return false;
    }

    const { boards, intl, activeBoardId, showNotification } = this.props;

    if (type !== 'pdf') {
      await EXPORT_HELPERS[exportConfig.callback](boards, intl);
    } else {
      const currentBoard = boards.filter(board => board.id === activeBoardId);
      await EXPORT_HELPERS[exportConfig.callback](currentBoard, intl);
    }
    isCordova()
      ? showNotification(intl.formatMessage(messages.boardDownloadedCva))
      : showNotification(intl.formatMessage(messages.boardDownloaded));
    doneCallback();
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
  boards: state.board.boards,
  activeBoardId: state.board.activeBoardId
});

const mapDispatchToProps = {
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(ExportContainer));
