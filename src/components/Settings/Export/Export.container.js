import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import { showNotification } from '../../Notifications/Notifications.actions';
import Export from './Export.component';
import { EXPORT_CONFIG_BY_TYPE } from './Export.constants';
import messages from './Export.messages';
import { isAndroid, isIOS } from '../../../cordova-util';

export class ExportContainer extends PureComponent {
  static propTypes = {
    boards: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    intl: intlShape.isRequired
  };

  handleExportClick = async (
    type = 'cboard',
    singleBoard = '',
    labelFontSize = '',
    doneCallback
  ) => {
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
    // TODO: Make this block easier to follow.
    try {
      if (type === 'openboard' && singleBoard) {
        await EXPORT_HELPERS.openboardExportAdapter(singleBoard, intl);
      } else if (type === 'cboard') {
        await EXPORT_HELPERS.cboardExportAdapter(boards, singleBoard);
      } else if (type === 'picsee_pdf') {
        if (singleBoard) {
          await EXPORT_HELPERS[exportConfig.callback](
            [singleBoard],
            labelFontSize,
            intl,
            true
          );
        } else {
          const currentBoard = boards.filter(
            board => board.id === activeBoardId
          );
          await EXPORT_HELPERS[exportConfig.callback](
            currentBoard,
            labelFontSize,
            intl,
            true
          );
        }
      } else if (type !== 'pdf' && !singleBoard) {
        await EXPORT_HELPERS[exportConfig.callback](
          boards,
          labelFontSize,
          intl
        );
      } else {
        if (singleBoard) {
          await EXPORT_HELPERS[exportConfig.callback](
            [singleBoard],
            labelFontSize,
            intl
          );
        } else {
          const currentBoard = boards.filter(
            board => board.id === activeBoardId
          );
          await EXPORT_HELPERS[exportConfig.callback](
            currentBoard,
            labelFontSize,
            intl
          );
        }
      }
      const showBoardDowloadedNotification = () => {
        if (isAndroid())
          return showNotification(
            intl.formatMessage(messages.boardDownloadedCva)
          );
        if (isIOS())
          return showNotification(
            intl.formatMessage(messages.boardDownloadedCvaIOS)
          );
        return showNotification(intl.formatMessage(messages.boardDownloaded));
      };

      showBoardDowloadedNotification();
    } catch (e) {
      console.error(e);
      const message = e.reason?.message?.startsWith('Failed to fetch')
        ? messages.downloadNoConnectionError
        : messages.boardDownloadError;
      showNotification(intl.formatMessage(message));
    }
    doneCallback();
  };

  render() {
    const { boards, intl, history } = this.props;

    return (
      <Export
        intl={intl}
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
