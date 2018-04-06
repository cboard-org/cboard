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
  addBoardTile,
  deleteBoardTiles,
  editBoardTiles,
  focusBoardTile,
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
      tiles: PropTypes.arrayOf(PropTypes.object)
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
     * Add tile
     */
    addTile: PropTypes.func,
    /**
     * Edit tiles
     */
    editTiles: PropTypes.func,
    /**
     * Delete tiles
     */
    deleteTiles: PropTypes.func,
    /**
     * Focuses a board tile
     */
    focusTile: PropTypes.func,
    /**
     * Change output
     */
    changeOutput: PropTypes.func,
    /**
     * Show notification
     */
    showNotification: PropTypes.func
  };

  handleBoardTileClick = tile => {
    const { changeBoard, changeOutput, speak } = this.props;

    if (tile.loadBoard) {
      changeBoard(tile.loadBoard);
    } else {
      changeOutput([...this.props.output, tile]);
      speak(tile.vocalization || tile.label);
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

  handleAddBoardTile = (tile, boardId) => {
    const { addBoardTile, showNotification } = this.props;

    addBoardTile(tile, boardId);
    showNotification('Tile added');
  };

  handleDeleteBoardTiles = (tiles, boardId) => {
    const { deleteBoardTiles, showNotification } = this.props;

    deleteBoardTiles(tiles, boardId);
    showNotification('Tile deleted');
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
      editBoardTiles,
      focusBoardTile
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
        onBoardTileClick={this.handleBoardTileClick}
        onRequestPreviousBoard={previousBoard}
        onAddBoard={addBoard}
        onAddBoardTile={this.handleAddBoardTile}
        onEditBoardTiles={editBoardTiles}
        onDeleteBoardTiles={this.handleDeleteBoardTiles}
        onFocusBoardTile={focusBoardTile}
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
  addBoardTile,
  deleteBoardTiles,
  editBoardTiles,
  focusBoardTile,
  changeOutput,
  speak,
  cancelSpeech,
  showNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardContainer);
