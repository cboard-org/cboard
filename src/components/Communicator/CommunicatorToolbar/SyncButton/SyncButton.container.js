import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import SyncButton from './SyncButton.component';
import { hasPendingSyncBoards } from '../../../Board/Board.selectors';
import { getApiMyBoards } from '../../../Board/Board.actions';

const mapStateToProps = (state, ownProps) => ({
  isOnline: state.app.isConnected,
  isSyncing: state.board.isSyncing,
  isFetching: state.board.isFetching,
  isSaving: ownProps.isSaving || false,
  hasPendingBoards: hasPendingSyncBoards(state)
});

const mapDispatchToProps = {
  onSyncClick: getApiMyBoards
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(SyncButton));
