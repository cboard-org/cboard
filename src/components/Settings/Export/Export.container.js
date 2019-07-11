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
    activeBoardId: PropTypes.string.isRequired,
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

    const { boards, activeBoardId, intl } = this.props;

    await EXPORT_HELPERS[exportConfig.callback](boards, intl, activeBoardId);

    doneCallback();
  };

  openboardExportAdapter(boards) {
    return boards;
  }

  render() {
    const { boards, history, activeBoardId } = this.props;

    return (
      <Export
        boards={boards}
        activeBoardId={activeBoardId}
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
