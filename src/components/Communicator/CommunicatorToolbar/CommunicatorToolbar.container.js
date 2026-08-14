import React from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import CommunicatorToolbar from "./CommunicatorToolbar.component";
import CommunicatorDialog from "../CommunicatorDialog";
import {
  switchBoard,
  replaceBoard,
  changeDefaultBoard
} from "../../Board/Board.actions";
import { showNotification } from "../../Notifications/Notifications.actions";
import { getVisibleBoards } from "../../Board/Board.selectors";
import {
  importCommunicator,
  deleteCommunicator,
  pushCommunicator
} from "../Communicator.actions";

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
    const { currentCommunicator, pushCommunicator } = this.props;

    const updatedCommunicatorData = {
      ...currentCommunicator,
      name
    };

    try {
      await pushCommunicator(updatedCommunicatorData);
    } catch (err) {
      console.error("Error upserting communicator", err);
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

export const mapStateToProps = (
  { board, communicator, app: { userData, displaySettings } },
  ownProps
) => {
  const activeCommunicatorId = communicator.activeCommunicatorId;
  const currentCommunicator = communicator.communicators.find(
    communicator => communicator.id === activeCommunicatorId
  );
  const activeBoardId = board.activeBoardId;
  const visibleBoards = getVisibleBoards({ board }).filter(
    board => board !== null && board.id !== null
  );
  // Render in the order stored on the communicator so the toolbar matches the
  // Quick access tray. Ids with no visible board (deleted, not yet synced) are
  // skipped rather than rendered as holes.
  const boards = currentCommunicator.boards
    .map(boardId => visibleBoards.find(board => board.id === boardId))
    .filter(Boolean);
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
  pushCommunicator,
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
