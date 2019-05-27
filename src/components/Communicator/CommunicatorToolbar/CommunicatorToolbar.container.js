import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import CommunicatorToolbar from './CommunicatorToolbar.component';
import CommunicatorDialog from '../CommunicatorDialog';
import { switchBoard, replaceBoard } from '../../Board/Board.actions';
import { showNotification } from '../../Notifications/Notifications.actions';
import {
  importCommunicator,
  createCommunicator,
  deleteCommunicator,
  changeCommunicator,
  upsertCommunicator
} from '../Communicator.actions';
import API from '../../../api';

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

  editCommunicatorTitle = async name => {
    const updatedCommunicatorData = {
      ...this.props.currentCommunicator,
      name
    };

    const communicatorData = await API.updateCommunicator(
      updatedCommunicatorData
    );

    this.props.upsertCommunicator(communicatorData);
    this.props.changeCommunicator(communicatorData.id);
  };

  render() {
    const toolbarProps = {
      ...this.props,
      isLoggedIn: !!this.props.userData.email,
      editCommunicatorTitle: this.editCommunicatorTitle,
      openCommunicatorDialog: this.openCommunicatorDialog.bind(this)
    };

    return (
      <React.Fragment>
        <CommunicatorToolbar {...toolbarProps} />
        {this.state.openDialog && (
          <CommunicatorDialog
            open={this.state.openDialog}
            onClose={this.closeCommunicatorDialog.bind(this)}
          />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (
  { board, communicator, app: { userData } },
  ownProps
) => {
  const activeCommunicatorId = communicator.activeCommunicatorId;
  const currentCommunicator = communicator.communicators.find(
    communicator => communicator.id === activeCommunicatorId
  );
  const activeBoardId = board.activeBoardId;
  const boards = board.boards.filter(board =>
    board !== null &&
    board.id !== null &&
    currentCommunicator.boards.includes(board.id));
  const currentBoard = boards.find(board => board.id === activeBoardId);

  return {
    communicators: communicator.communicators,
    boards,
    currentCommunicator,
    currentBoard,
    userData,
    ...ownProps
  };
};

const mapDispatchToProps = {
  importCommunicator,
  createCommunicator,
  deleteCommunicator,
  changeCommunicator,
  upsertCommunicator,
  showNotification,
  switchBoard,
  replaceBoard
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(withRouter(CommunicatorContainer)));
