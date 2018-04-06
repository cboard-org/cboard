import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  speak,
  cancelSpeech
} from '../../providers/SpeechProvider/SpeechProvider.actions';
import { showNotification } from '../Notifications/Notifications.actions';
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
    changeOutput: PropTypes.func,
    /**
     * Show notification
     */
    showNotification: PropTypes.func
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

  handleAddBoardButton = (button, boardId) => {
    const { addBoardButton, showNotification } = this.props;

    addBoardButton(button, boardId);
    showNotification('Button added');
  };

  handleDeleteBoardButtons = (buttons, boardId) => {
    const { deleteBoardButtons, showNotification } = this.props;

    deleteBoardButtons(buttons, boardId);
    showNotification('Button deleted');
  };

  handleLockNotify = message => {
    const { showNotification } = this.props;
    showNotification(message);
  };

  render() {
    const {
      dir,
      navHistory,
      board,
      output,
      previousBoard,
      addBoard,
      editBoardButtons,
      focusBoardButton
    } = this.props;

    return (
      <Board
        dir={dir}
        disableNav={navHistory.length === 1}
        board={board}
        output={output}
        onLockNotify={this.handleLockNotify}
        onOutputChange={this.handleOutputChange}
        onOutputClick={this.handleOutputClick}
        onBoardButtonClick={this.handleBoardButtonClick}
        onRequestPreviousBoard={previousBoard}
        onAddBoard={addBoard}
        onAddBoardButton={this.handleAddBoardButton}
        onEditBoardButtons={editBoardButtons}
        onDeleteBoardButtons={this.handleDeleteBoardButtons}
        onFocusBoardButton={focusBoardButton}
      />
    );
  }
}

const mapStateToProps = ({ board, language }) => {
  const activeBoardId = board.activeBoardId;

  return {
    board: board.boards.find(board => board.id === activeBoardId),
    output: board.output,
    navHistory: board.navHistory,
    dir: language.dir
  };
};

const mapDispatchToProps = {
  changeBoard,
  previousBoard,
  addBoard,
  addBoardButton,
  deleteBoardButtons,
  editBoardButtons,
  focusBoardButton,
  changeOutput,
  speak,
  cancelSpeech,
  showNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardContainer);
