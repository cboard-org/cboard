import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import keycode from 'keycode';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import Grid from '../Grid';
import SymbolOutput from './SymbolOutput';
import Navbar from './Navbar';
import EditToolbar from './EditToolbar';
import BoardTileEditor from './BoardTileEditor';
import BoardTile from './BoardTile';
import EmptyBoard from './EmptyBoard';

import './Board.css';

export class Board extends Component {
  static propTypes = {
    /**
     * @ignore
     */
    className: PropTypes.string,
    /**
     * @ignore
     */
    intl: intlShape.isRequired,
    /**
     * Board to display
     */
    board: PropTypes.shape({
      id: PropTypes.string,
      tiles: PropTypes.arrayOf(PropTypes.object)
    }),
    /**
     * If true, navigation of boards will be disabled
     */
    disableNav: PropTypes.bool,
    /**
     * Callback fired when a board tile is clicked
     */
    onBoardTileClick: PropTypes.func,
    /**
     * Callback fired when a board is added
     */
    onAddBoard: PropTypes.func,
    /**
     * Callback fired when a board tile is added
     */
    onAddBoardTile: PropTypes.func,
    /**
     * Callback fired when board tiles were edited
     */
    onEditBoardTiles: PropTypes.func,
    /**
     * Callback fired when board tiles are deleted
     */
    onDeleteBoardTiles: PropTypes.func,
    /**
     * Callback fired when requesting to load a board
     */
    onRequestLoadBoard: PropTypes.func,
    /**
     * Callback fired when requesting to load previous board
     */
    onRequestPreviousBoard: PropTypes.func,
    /**
     * Callback fired when a board tile is focused
     */
    onFocusBoardTile: PropTypes.func,
    /**
     * Callback fired when a board output changes
     */
    onOutputChange: PropTypes.func,
    /**
     * Callback fired when a output scroll container is clicked
     */
    onOutputClick: PropTypes.func
  };

  state = {
    selectedTiles: [],
    isSelecting: false,
    isLocked: true,
    boardTileEditorOpen: false
  };

  toggleSelectMode() {
    this.setState(prevState => ({
      isSelecting: !prevState.isSelecting,
      selectedTiles: []
    }));
  }

  selectBoardTile(tileId) {
    this.setState({
      selectedTiles: [...this.state.selectedTiles, tileId]
    });
  }

  deselectBoardTile(tileId) {
    const [...selectedTiles] = this.state.selectedTiles;
    const tileIndex = selectedTiles.indexOf(tileId);
    selectedTiles.splice(tileIndex, 1);
    this.setState({ selectedTiles });
  }

  toggleBoardTileSelect(tileId) {
    if (this.state.selectedTiles.includes(tileId)) {
      this.deselectBoardTile(tileId);
    } else {
      this.selectBoardTile(tileId);
    }
  }

  handleBoardTileClick = tile => {
    const { onBoardTileClick } = this.props;

    if (this.state.isSelecting) {
      this.toggleBoardTileSelect(tile.id);
      return;
    }

    if (tile.loadBoard) {
      this.boardTiles.scrollTop = 0;
    }
    onBoardTileClick(tile);
  };

  handleBoardTileFocus = tileId => {
    const { onFocusBoardTile, board } = this.props;
    onFocusBoardTile(tileId, board.id);
  };

  handleBackClick = () => {
    const { onRequestPreviousBoard } = this.props;
    onRequestPreviousBoard();
  };

  handleSelectClick = () => {
    this.toggleSelectMode();
  };

  handleAddClick = () => {
    this.setState({
      boardTileEditorOpen: true,
      selectedTiles: [],
      isSelecting: false
    });
  };

  handleEditClick = () => {
    this.setState({ boardTileEditorOpen: true });
  };

  handleDeleteClick = () => {
    const { onDeleteBoardTiles, board } = this.props;
    this.setState({ selectedTiles: [] });
    onDeleteBoardTiles(this.state.selectedTiles, board.id);
  };

  handleBoardTileEditorCancel = () => {
    this.setState({ boardTileEditorOpen: false });
  };

  handleEditBoardTileEditorSubmit = tiles => {
    const { board, onEditBoardTiles } = this.props;
    onEditBoardTiles(tiles, board.id);
    this.toggleSelectMode();
  };

  handleAddBoardTileEditorSubmit = tile => {
    const { onAddBoardTile, onAddBoard, board } = this.props;

    if (tile.loadBoard) {
      const {
        loadBoard: boardId,
        label: boardName,
        labelKey: boardNameKey
      } = tile;

      onAddBoard(boardId, boardName, boardNameKey);
    }
    onAddBoardTile(tile, board.id);
  };

  handleLockClick = () => {
    this.setState((state, props) => ({
      isLocked: !state.isLocked,
      isSelecting: false,
      selectedTiles: []
    }));
  };

  handleLockNotify = message => {
    const { onLockNotify } = this.props;
    onLockNotify(message);
  };

  handleBoardKeyUp = event => {
    if (event.keyCode === keycode('esc')) {
      this.handleBackClick();
    }
  };

  handleOutputClick = () => {
    const { intl, output, onOutputClick } = this.props;

    const translatedOutput = output.map(value => {
      const label = value.labelKey
        ? intl.formatMessage({ id: value.labelKey })
        : value.label;
      return { ...value, label };
    });
    onOutputClick(translatedOutput);
  };

  generateBoardTiles(boardTiles, boardId) {
    const {
      intl,
      board: { focusedBoardTileId }
    } = this.props;

    return Object.keys(boardTiles).map((id, index) => {
      const tile = boardTiles[id];
      const isSelected = this.state.selectedTiles.includes(tile.id);
      const hasFocus = focusedBoardTileId
        ? tile.id === focusedBoardTileId
        : index === 0;

      const label = tile.labelKey
        ? intl.formatMessage({ id: tile.labelKey })
        : tile.label;

      return (
        <div key={tile.id}>
          <BoardTile
            {...tile}
            label={label}
            hasFocus={hasFocus}
            onClick={this.handleBoardTileClick}
            onFocus={this.handleBoardTileFocus}
          >
            {isSelected && <CheckCircleIcon className="CheckCircleIcon" />}
          </BoardTile>
        </div>
      );
    });
  }

  render() {
    const {
      intl,
      dir,
      disableBackButton,
      board,
      output,
      onOutputChange
    } = this.props;

    const translatedOutput = output.map(value => {
      const label = value.labelKey
        ? intl.formatMessage({ id: value.labelKey })
        : value.label;
      return { ...value, label };
    });

    const boardName = board.nameKey
      ? intl.formatMessage({ id: board.nameKey })
      : board.name;

    const boardTiles = this.generateBoardTiles(board.tiles, board.id);

    return (
      <div
        className={classNames('Board', {
          'is-selecting': this.state.isSelecting,
          'is-locked': this.state.isLocked
        })}
      >
        <SymbolOutput
          className="Board__output"
          dir={dir}
          values={translatedOutput}
          onChange={onOutputChange}
          onClick={this.handleOutputClick}
        />

        <Navbar
          className="Board__navbar"
          title={boardName}
          disabled={disableBackButton || this.state.isSelecting}
          isLocked={this.state.isLocked}
          onBackClick={this.handleBackClick}
          onLockClick={this.handleLockClick}
          onLockNotify={this.handleLockNotify}
          onSettingsClick={this.handleSettingsClick}
        />

        <EditToolbar
          className="Board__edit-toolbar"
          isSelecting={this.state.isSelecting}
          selectedItemsCount={this.state.selectedTiles.length}
          onSelectClick={this.handleSelectClick}
          onAddClick={this.handleAddClick}
          onEditClick={this.handleEditClick}
          onDeleteClick={this.handleDeleteClick}
        />

        <div
          className="Board__tiles"
          onKeyUp={this.handleBoardKeyUp}
          ref={ref => {
            this.boardTiles = ref;
          }}
        >
          {boardTiles.length ? (
            <Grid
              id={board.id}
              edit={this.state.isSelecting}
              onDrag={this.handleDrag}
            >
              {boardTiles}
            </Grid>
          ) : (
            <EmptyBoard />
          )}
        </div>

        <BoardTileEditor
          editingBoardTiles={this.state.selectedTiles.map(
            selectedBoardTileId =>
              board.tiles.filter(boardTile => {
                return boardTile.id === selectedBoardTileId;
              })[0]
          )}
          open={this.state.boardTileEditorOpen}
          onClose={this.handleBoardTileEditorCancel}
          onEditSubmit={this.handleEditBoardTileEditorSubmit}
          onAddSubmit={this.handleAddBoardTileEditorSubmit}
        />
      </div>
    );
  }
}

export default injectIntl(Board);
