import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import CommunicatorToolbar from './CommunicatorToolbar.component';
import CommunicatorDialog from '../CommunicatorDialog';
import { switchBoard } from '../../Board/Board.actions';
import {
  importCommunicator,
  createCommunicator,
  deleteCommunicator,
  changeCommunicator
} from '../Communicator.actions';

class CommunicatorContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openDialog: false
    };
  }

  openCommunicatorDialog() {
    this.setState({ openDialog: true });
  }

  closeCommunicatorDialog() {
    this.setState({ openDialog: false });
  }

  render() {
    const toolbarProps = {
      ...this.props,
      openCommunicatorDialog: this.openCommunicatorDialog.bind(this)
    };

    return (
      <React.Fragment>
        <CommunicatorToolbar {...toolbarProps} />
        <CommunicatorDialog
          open={this.state.openDialog}
          onClose={this.closeCommunicatorDialog.bind(this)}
        />
      </React.Fragment>
    );
  }
}

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
