import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import CommunicatorToolbar from './CommunicatorToolbar.component';
import { switchBoard } from '../../Board/Board.actions';
import {
  importCommunicator,
  createCommunicator,
  deleteCommunicator,
  changeCommunicator
} from '../Communicator.actions';

const CommunicatorContainer = props => <CommunicatorToolbar {...props} />;

const mapStateToProps = ({ board, communicator, language }, ownProps) => {
  const activeCommunicatorId = communicator.activeCommunicatorId;
  const currentCommunicator = communicator.communicators.find(
    communicator => communicator.id === activeCommunicatorId
  );

  const activeBoardId = board.activeBoardId;
  const boards = board.boards.filter(
    board => currentCommunicator.boards.indexOf(board.id) >= 0
  );
  const currentBoard = boards.find(board => board.id === activeBoardId);

  return {
    communicators: communicator.communicators,
    boards,
    currentCommunicator,
    currentBoard,
    ...ownProps
  };
};

const mapDispatchToProps = {
  importCommunicator,
  createCommunicator,
  deleteCommunicator,
  changeCommunicator,
  switchBoard
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(CommunicatorContainer));
