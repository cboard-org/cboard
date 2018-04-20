import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import keycode from 'keycode';
import classNames from 'classnames';

import { showNotification } from '../Notifications/Notifications.actions';
import {
  speak,
  cancelSpeech
} from '../../providers/SpeechProvider/SpeechProvider.actions';
import {
  lockBoard,
  unlockBoard,
  changeBoard,
  previousBoard,
  createBoard,
  createTile,
  deleteTiles,
  editTiles,
  focusTile,
  changeOutput
} from './Board.actions';
import SymbolOutput from './SymbolOutput';
import Navbar from './Navbar';
import EditToolbar from './EditToolbar';
import TileEditor from './TileEditor';
import BoardTiles from './BoardTiles.component';
import messages from './Board.messages';

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

  state = {
    selectedTileIds: [],
    isSelecting: false,
    isLocked: true,
    tileEditorOpen: false
  };

  toggleSelectMode() {
    this.setState(prevState => ({
      isSelecting: !prevState.isSelecting,
      selectedTileIds: []
    }));
  }

  selectTile(tileId) {
    this.setState({
      selectedTileIds: [...this.state.selectedTileIds, tileId]
    });
  }

  deselectTile(tileId) {
    const [...selectedTileIds] = this.state.selectedTileIds;
    const tileIndex = selectedTileIds.indexOf(tileId);
    selectedTileIds.splice(tileIndex, 1);
    this.setState({ selectedTileIds });
  }

  toggleTileSelect(tileId) {
    if (this.state.selectedTileIds.includes(tileId)) {
      this.deselectTile(tileId);
    } else {
      this.selectTile(tileId);
    }
  }

  handleTileClick = tile => {
    const { changeBoard, changeOutput, speak } = this.props;

    if (this.state.isSelecting) {
      this.toggleTileSelect(tile.id);
      return;
    }

    if (tile.loadBoard) {
      changeBoard(tile.loadBoard);
    } else {
      changeOutput([...this.props.output, tile]);
      speak(tile.vocalization || tile.label);
    }
  };

  speakOutput = output => {
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

  handleLockNotify = message => {
    const { showNotification } = this.props;
    showNotification(message);
  };

  handleSelectClick = () => {
    this.toggleSelectMode();
  };

  handleAddClick = () => {
    this.setState({
      tileEditorOpen: true,
      selectedTileIds: [],
      isSelecting: false
    });
  };

  handleEditClick = () => {
    this.setState({ tileEditorOpen: true });
  };

  handleDeleteClick = () => {
    const { intl, board, deleteTiles, showNotification } = this.props;
    deleteTiles(this.state.selectedTileIds, board.id);
    this.setState({ selectedTileIds: [] });
    showNotification(intl.formatMessage(messages.tilesDeleted));
  };

  handleTileEditorCancel = () => {
    this.setState({ tileEditorOpen: false });
  };

  handleEditTileEditorSubmit = tiles => {
    const { board, editTiles } = this.props;
    editTiles(tiles, board.id);
    this.toggleSelectMode();
  };

  handleAddTileEditorSubmit = tile => {
    const {
      intl,
      createTile,
      createBoard,
      board,
      showNotification
    } = this.props;

    if (tile.loadBoard) {
      const {
        loadBoard: boardId,
        label: boardName,
        labelKey: boardNameKey
      } = tile;

      createBoard(boardId, boardName, boardNameKey);
    }

    showNotification(intl.formatMessage(messages.tilesCreated));
    createTile(tile, board.id);
  };

  handleLockClick = () => {
    const { isLocked, unlockBoard, lockBoard } = this.props;
    this.setState((state, props) => ({
      isSelecting: false,
      selectedTileIds: []
    }));

    if (isLocked) {
      unlockBoard();
    } else {
      lockBoard();
    }
  };

  handleBoardKeyUp = event => {
    const { previousBoard } = this.props;
    if (event.keyCode === keycode('esc')) {
      previousBoard();
    }
  };

  handleOutputClick = () => {
    const { intl, output } = this.props;

    const translatedOutput = output.map(value => {
      const label = value.labelKey
        ? intl.formatMessage({ id: value.labelKey })
        : value.label;
      return { ...value, label };
    });
    this.speakOutput(translatedOutput);
  };

  render() {
    const {
      dir,
      navHistory,
      output,
      board,
      isLocked,
      previousBoard,
      focusTile
    } = this.props;

    const disableBackButton = navHistory.length === 1;

    return (
      <div
        className={classNames('Board', {
          'is-selecting': this.state.isSelecting,
          'is-locked': isLocked
        })}
      >
        <div className="Board__output">
          <SymbolOutput
            dir={dir}
            values={output}
            onChange={this.handleOutputChange}
            onClick={this.handleOutputClick}
          />
        </div>

        <div className="Board__navbar">
          <Navbar
            title={board.name}
            disabled={disableBackButton || this.state.isSelecting}
            isLocked={isLocked}
            onBackClick={previousBoard}
            onLockClick={this.handleLockClick}
            onLockNotify={this.handleLockNotify}
          />
        </div>

        <div className="Board__edit-toolbar">
          <EditToolbar
            isSelecting={this.state.isSelecting}
            selectedItemsCount={this.state.selectedTileIds.length}
            onSelectClick={this.handleSelectClick}
            onAddClick={this.handleAddClick}
            onEditClick={this.handleEditClick}
            onDeleteClick={this.handleDeleteClick}
          />
        </div>
        <div className="Board__tiles">
          <BoardTiles
            isSelecting={this.state.isSelecting}
            selectedTileIds={this.state.selectedTileIds}
            boardId={board.id}
            tiles={board.tiles}
            onClick={this.handleTileClick}
            onFocus={focusTile}
          />
        </div>
        <TileEditor
          editingTiles={this.state.selectedTileIds.map(
            selectedTileId =>
              board.tiles.filter(tile => {
                return tile.id === selectedTileId;
              })[0]
          )}
          open={this.state.tileEditorOpen}
          onClose={this.handleTileEditorCancel}
          onEditSubmit={this.handleEditTileEditorSubmit}
          onAddSubmit={this.handleAddTileEditorSubmit}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ board, language }) => {
  const activeBoardId = board.activeBoardId;

  return {
    board: board.boards.find(board => board.id === activeBoardId),
    output: board.output,
    navHistory: board.navHistory,
    isLocked: board.isLocked,
    dir: language.dir
  };
};

const mapDispatchToProps = {
  lockBoard,
  unlockBoard,
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
