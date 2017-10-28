import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { speak, cancelSpeech } from '../SpeechProvider/SpeechProvider.actions';

import {
  changeBoard,
  previousBoard,
  addBoard,
  addBoardButton,
  deleteBoardButtons,
  editBoardButtons,
  focusBoardButton,
  changeOutput
} from './Board.actions';
import { showNotification } from '../Notifications/Notifications.actions';
import Board from './Board.component';

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
     * Active board
     */
    board: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      buttons: PropTypes.arrayOf(PropTypes.object)
    }),
    /**
     * Board output
     */
    output: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        img: PropTypes.string,
        vocalization: PropTypes.string
      })
    ),
    /**
     * Load board
     */
    changeBoard: PropTypes.func,
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
    focusButton: PropTypes.func,
    /**
     * Change output
     */
    changeOutput: PropTypes.func
  };

  handleBoardButtonClick = button => {
    const { changeBoard, changeOutput, speak } = this.props;

    if (button.loadBoard) {
      changeBoard(button.loadBoard);
    } else {
      changeOutput([...this.props.output, button]);
      speak(button.vocalization || button.label);
    }
  };

  handleOutputClick = output => {
    const { speak, cancelSpeech } = this.props;
    const reducedOutput = output.reduce(
      (output, value) => output + (value.vocalization || value.label) + ' ',
      ''
    );
    cancelSpeech();
    speak(reducedOutput);
  };

  handleOutputChange = output => {
    const { changeOutput, cancelSpeech } = this.props;
    cancelSpeech();
    changeOutput(output);
  };

  render() {
    const {
      dir,
      navHistory,
      board,
      output,
      previousBoard,
      addBoard,
      addBoardButton,
      editBoardButtons,
      deleteBoardButtons,
      focusBoardButton
    } = this.props;

    return (
      <Board
        dir={dir}
        navHistory={navHistory} // todo: Board component shouldn't be aware of navHistory
        board={board}
        output={output}
        onOutputChange={this.handleOutputChange}
        onOutputClick={this.handleOutputClick}
        onBoardButtonClick={this.handleBoardButtonClick}
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
    output: board.output,
    navHistory: board.navHistory,
    dir: language.dir
  };
};

const mapDispatchToProps = dispatch => ({
  changeBoard: boardId => {
    dispatch(changeBoard(boardId));
  },
  previousBoard: () => {
    dispatch(previousBoard());
  },
  addBoard: (boardId, boardName, BoardNameKey) => {
    dispatch(addBoard(boardId, boardName, BoardNameKey));
  },
  addBoardButton: (button, boardId) => {
    dispatch(addBoardButton(button, boardId));
    dispatch(showNotification('Button added'));
  },
  deleteBoardButtons: (buttons, boardId) => {
    dispatch(deleteBoardButtons(buttons, boardId));
    dispatch(showNotification('Button deleted'));
  },
  editBoardButtons: (buttons, boardId) => {
    dispatch(editBoardButtons(buttons, boardId));
  },
  focusBoardButton: (buttonId, boardId) => {
    dispatch(focusBoardButton(buttonId, boardId));
  },
  changeOutput: output => {
    dispatch(changeOutput(output));
  },
  speak: text => {
    dispatch(speak(text));
  },
  cancelSpeech: () => {
    dispatch(cancelSpeech());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BoardContainer);
