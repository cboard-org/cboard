import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Board from './Board.component';

import {
  loadBoard,
  previousBoard,
  addBoard,
  addBoardButton,
  deleteBoardButtons,
  editBoardButtons,
  focusBoardButton
} from './Board.actions';
import { showNotification } from '../Notifications/Notifications.actions';

export class BoardContainer extends PureComponent {
  static propTypes = {
    /**
     * Board direction
     */
    dir: PropTypes.string,
    /**
     * Board navigation history stack
     */
    navHistory: PropTypes.arrayOf(PropTypes.string),
    /**
     * Active board to display
     */
    board: PropTypes.shape({
      id: PropTypes.string,
      buttons: PropTypes.arrayOf(PropTypes.object)
    }),
    /**
     * Load board
     */
    loadBoard: PropTypes.func,
    /**
     * Load previous board
     */
    previousBoard: PropTypes.func,
    /**
     * Add board
     */
    addBoard: PropTypes.func,
    /**
     * Add button
     */
    addButton: PropTypes.func,
    /**
     * Edit buttons
     */
    editButtons: PropTypes.func,
    /**
     * Delete buttons
     */
    deleteButtons: PropTypes.func,
    /**
     * Focuses a board button
     */
    focusButton: PropTypes.func
  };

  render() {
    const {
      dir,
      navHistory,
      board,
      loadBoard,
      previousBoard,
      addBoard,
      addBoardButton,
      editBoardButtons,
      deleteBoardButtons,
      focusBoardButton
    } = this.props;

    return (
      <Board
        board={board}
        navHistory={navHistory}
        dir={dir}
        onRequestLoadBoard={loadBoard}
        onRequestPreviousBoard={previousBoard}
        onAddBoard={addBoard}
        onAddBoardButton={addBoardButton}
        onEditBoardButtons={editBoardButtons}
        onDeleteBoardButtons={deleteBoardButtons}
        onFocusBoardButton={focusBoardButton}
      />
    );
  }
}

const mapStateToProps = state => {
  const { board, language } = state;
  const activeBoardId = board.activeBoardId;

  return {
    board: board.boards.find(board => board.id === activeBoardId),
    navHistory: board.navHistory,
    dir: language.dir
  };
};

const mapDispatchToProps = dispatch => ({
  loadBoard: boardId => dispatch(loadBoard(boardId)),
  previousBoard: () => dispatch(previousBoard()),
  addBoard: boardId => dispatch(addBoard(boardId)),
  addBoardButton: (button, boardId) => {
    dispatch(addBoardButton(button, boardId));
    dispatch(showNotification('Button added'));
  },
  deleteBoardButtons: (buttons, boardId) => {
    dispatch(deleteBoardButtons(buttons, boardId));
    dispatch(showNotification('Button deleted'));
  },
  editBoardButtons: (buttons, boardId) =>
    dispatch(editBoardButtons(buttons, boardId)),
  focusBoardButton: (buttonId, boardId) =>
    dispatch(focusBoardButton(buttonId, boardId))
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardContainer);
