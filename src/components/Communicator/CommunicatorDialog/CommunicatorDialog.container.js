import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import CommunicatorDialog from './CommunicatorDialog.component';
import {
  addBoardCommunicator,
  verifyAndUpsertCommunicator,
  upsertApiCommunicator
} from '../Communicator.actions';
import {
  deleteBoard,
  deleteApiBoard,
  addBoards,
  replaceBoard,
  createBoard,
  updateBoard,
  updateApiObjectsNoChild,
  updateApiBoard,
  switchBoard
} from '../../Board/Board.actions';
import { showNotification } from '../../Notifications/Notifications.actions';
import { getVisibleBoards } from '../../Board/Board.selectors';
import { disableTour } from '../../App/App.actions';

export const mapStateToProps = ({ board, communicator, language, app }) => {
  const activeCommunicatorId = communicator.activeCommunicatorId;
  const currentCommunicator = communicator.communicators.find(
    (c) => c.id === activeCommunicatorId
  );

  const visibleBoards = getVisibleBoards({ board });
  const communicatorBoards = visibleBoards.filter(
    (b) => currentCommunicator.boards.indexOf(b.id) >= 0
  );

  const communicatorTour = app.liveHelp.communicatorTour || {
    isCommBoardsEnabled: true,
    isPublicBoardsEnabled: true,
    isAllMyBoardsEnabled: true
  };

  return {
    communicators: communicator.communicators,
    currentCommunicator,
    communicatorBoards,
    availableBoards: visibleBoards,
    userData: app.userData,
    language,
    activeBoardId: board.activeBoardId,
    communicatorTour,
    isSymbolSearchTourEnabled: app.liveHelp.isSymbolSearchTourEnabled
  };
};

const mapDispatchToProps = {
  addBoards,
  replaceBoard,
  showNotification,
  deleteBoard,
  deleteApiBoard,
  createBoard,
  updateBoard,
  addBoardCommunicator,
  updateApiObjectsNoChild,
  updateApiBoard,
  disableTour,
  verifyAndUpsertCommunicator,
  upsertApiCommunicator,
  switchBoard
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(CommunicatorDialog));
