import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import CommunicatorToolbar from './CommunicatorToolbar.component';
import CommunicatorDialog from '../CommunicatorDialog';
import {
  switchBoard,
  replaceBoard,
  changeDefaultBoard
} from '../../Board/Board.actions';
import { showNotification } from '../../Notifications/Notifications.actions';
import {
  importCommunicator,
  deleteCommunicator,
  verifyAndUpsertCommunicator
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

  editCommunicatorTitle = async name => {
    const {
      currentCommunicator,
      verifyAndUpsertCommunicator,
      upsertApiCommunicator,
      userData
    } = this.props;

    const updatedCommunicatorData = {
      ...currentCommunicator,
      name
    };

    const upsertedCommunicator = verifyAndUpsertCommunicator(
      updatedCommunicatorData
    );

    if ('name' in userData && 'email' in userData) {
      try {
        await upsertApiCommunicator(upsertedCommunicator);
      } catch (err) {
        console.error('Error upserting communicator', err);
      }
    }
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

const mapStateToProps = ({ board, communicator, app }, ownProps) => {
  const { userData, displaySettings } = app;
  const activeCommunicatorId = communicator.activeCommunicatorId;
  const currentCommunicator = communicator.communicators.find(
    communicator => communicator.id === activeCommunicatorId
  );
  const activeBoardId = board.activeBoardId;
  const boards = board.boards.filter(
    board =>
      board !== null &&
      board.id !== null &&
      currentCommunicator.boards.includes(board.id)
  );
  const currentBoard = boards.find(board => board.id === activeBoardId);

  return {
    communicators: communicator.communicators,
    boards,
    currentCommunicator,
    currentBoard,
    userData,
    isDark: displaySettings.darkThemeActive,
    ...ownProps
  };
};

const mapDispatchToProps = {
  importCommunicator,
  verifyAndUpsertCommunicator,
  deleteCommunicator,
  showNotification,
  switchBoard,
  replaceBoard,
  changeDefaultBoard
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(withRouter(CommunicatorContainer)));
