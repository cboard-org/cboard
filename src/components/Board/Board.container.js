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
  createBoard,
  createTile,
  deleteTiles,
  editTiles,
  focusTile,
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
        image: PropTypes.string,
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
     * Create board
     */
    createBoard: PropTypes.func,
    /**
     * Create tile
     */
    createTile: PropTypes.func,
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

  handleTileClick = tile => {
    const { changeBoard, changeOutput, speak } = this.props;
    const hasAction = tile.action && tile.action.startsWith('+');

    if (tile.loadBoard) {
      changeBoard(tile.loadBoard);
    } else {
      changeOutput([...this.props.output, tile]);
      let toSpeak = tile.vocalization || tile.label;
      if (hasAction) {
        const prevOutput = this.props.output.length
          ? this.props.output[this.props.output.length - 1]
          : null;
        toSpeak = prevOutput
          ? `${prevOutput.vocalization || prevOutput.label}${tile.action.slice(
              1
            )}`
          : null;
      }

      if (toSpeak) {
        speak(toSpeak);
      }
    }
  };

  handleOutputClick = output => {
    const { speak, cancelSpeech } = this.props;
    const reducedOutput = output.reduce((output, value) => {
      const currentOutputValue =
        value.action && value.action.startsWith('+')
          ? value.action.slice(1)
          : ` ${value.vocalization || value.label}`;
      return ` ${output}${currentOutputValue}`;
    }, '');
    cancelSpeech();
    speak(reducedOutput.trim());
  };

  handleOutputChange = output => {
    const { changeOutput, cancelSpeech } = this.props;
    cancelSpeech();
    changeOutput(output);
  };

  handleAddTile = (tile, boardId) => {
    const { intl, createTile, showNotification } = this.props;
    createTile(tile, boardId);
    showNotification(intl.formatMessage(messages.tilesCreated));
  };

  handleDeleteTiles = (tiles, boardId) => {
    const { intl, deleteTiles, showNotification } = this.props;
    deleteTiles(tiles, boardId);
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
      createBoard,
      editTiles,
      focusTile
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
        onTileClick={this.handleTileClick}
        onRequestPreviousBoard={previousBoard}
        onAddBoard={createBoard}
        onAddTile={this.handleAddTile}
        onEditTiles={editTiles}
        onDeleteTiles={this.handleDeleteTiles}
        onFocusTile={focusTile}
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
  createBoard,
  createTile,
  deleteTiles,
  editTiles,
  focusTile,
  changeOutput,
  speak,
  cancelSpeech,
  showNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(BoardContainer)
);
