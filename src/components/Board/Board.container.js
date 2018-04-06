import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import { showNotification } from '../Notifications/Notifications.actions';
import {
  speak,
  cancelSpeech
} from '../../providers/SpeechProvider/SpeechProvider.actions';
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
import messages from './Board.messages';
import Board from './Board.component';

export class BoardContainer extends PureComponent {
  static propTypes = {
    /**
     * @ignore
     */
    intl: intlShape.isRequired,
    /**
     * Language direction
     */
    dir: PropTypes.string,
    /**
     * Board history navigation stack
     */
    navHistory: PropTypes.arrayOf(PropTypes.string),
    /**
     * Board to display
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
    addBoardTile: PropTypes.func,
    /**
     * Edit tiles
     */
    editBoardTiles: PropTypes.func,
    /**
     * Delete tiles
     */
    deleteBoardTiles: PropTypes.func,
    /**
     * Focuses a board tile
     */
    focusBoardTile: PropTypes.func,
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
    const { intl, addBoardTile, showNotification } = this.props;
    addBoardTile(tile, boardId);
    showNotification(intl.formatMessage(messages.tilesCreated));
  };

  handleDeleteBoardTiles = (tiles, boardId) => {
    const { intl, deleteBoardTiles, showNotification } = this.props;
    deleteBoardTiles(tiles, boardId);
    showNotification(intl.formatMessage(messages.tilesDeleted));
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

    const disableBackButton = navHistory.length === 1;

    return (
      <Board
        dir={dir}
        disableBackButton={disableBackButton}
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

export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(BoardContainer)
);
