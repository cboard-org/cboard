import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import keycode from 'keycode';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import Grid from '../Grid';
import Symbol from './Symbol';
import SymbolOutput from './SymbolOutput';
import Navbar from './Navbar';
import EditToolbar from './EditToolbar';
import TileEditor from './TileEditor';
import Tile from './Tile';
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
    onTileClick: PropTypes.func,
    /**
     * Callback fired when a board is added
     */
    onAddBoard: PropTypes.func,
    /**
     * Callback fired when a board tile is added
     */
    onAddTile: PropTypes.func,
    /**
     * Callback fired when board tiles were edited
     */
    onEditTiles: PropTypes.func,
    /**
     * Callback fired when board tiles are deleted
     */
    onDeleteTiles: PropTypes.func,
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
    onFocusTile: PropTypes.func,
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
    const { onTileClick } = this.props;

    if (this.state.isSelecting) {
      this.toggleTileSelect(tile.id);
      return;
    }

    if (tile.loadBoard) {
      this.tiles.scrollTop = 0;
    }
    onTileClick(tile);
  };

  handleTileFocus = tileId => {
    const { onFocusTile, board } = this.props;
    onFocusTile(tileId, board.id);
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
      tileEditorOpen: true,
      selectedTileIds: [],
      isSelecting: false
    });
  };

  handleEditClick = () => {
    this.setState({ tileEditorOpen: true });
  };

  handleDeleteClick = () => {
    const { onDeleteTiles, board } = this.props;
    this.setState({ selectedTileIds: [] });
    onDeleteTiles(this.state.selectedTileIds, board.id);
  };

  handleTileEditorCancel = () => {
    this.setState({ tileEditorOpen: false });
  };

  handleEditTileEditorSubmit = tiles => {
    const { board, onEditTiles } = this.props;
    onEditTiles(tiles, board.id);
    this.toggleSelectMode();
  };

  handleAddTileEditorSubmit = tile => {
    const { onAddTile, onAddBoard, board } = this.props;

    if (tile.loadBoard) {
      const {
        loadBoard: boardId,
        label: boardName,
        labelKey: boardNameKey
      } = tile;

      onAddBoard(boardId, boardName, boardNameKey);
    }
    onAddTile(tile, board.id);
  };

  handleLockClick = () => {
    this.setState((state, props) => ({
      isLocked: !state.isLocked,
      isSelecting: false,
      selectedTileIds: []
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

  generateTiles(tiles, boardId) {
    const { intl } = this.props;

    return Object.keys(tiles).map((id, index) => {
      const tile = tiles[id];
      const isSelected = this.state.selectedTileIds.includes(tile.id);

      const label = tile.labelKey
        ? intl.formatMessage({ id: tile.labelKey })
        : tile.label;
      tile.label = label;
      const variant = Boolean(tile.loadBoard) ? 'folder' : 'tile';

      return (
        <div key={tile.id}>
          <Tile
            backgroundColor={tile.backgroundColor}
            variant={variant}
            onClick={() => {
              this.handleTileClick(tile);
            }}
            onFocus={() => {
              this.handleTileFocus(tile.id);
            }}
          >
            <Symbol image={tile.image} label={label} />
            {this.state.isSelecting && (
              <div className="CheckCircle">
                {isSelected && (
                  <CheckCircleIcon className="CheckCircle__icon" />
                )}
              </div>
            )}
          </Tile>
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

    const tiles = this.generateTiles(board.tiles, board.id);

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
          selectedItemsCount={this.state.selectedTileIds.length}
          onSelectClick={this.handleSelectClick}
          onAddClick={this.handleAddClick}
          onEditClick={this.handleEditClick}
          onDeleteClick={this.handleDeleteClick}
        />

        <div
          className="Board__tiles"
          onKeyUp={this.handleBoardKeyUp}
          ref={ref => {
            this.tiles = ref;
          }}
        >
          {tiles.length ? (
            <Grid
              id={board.id}
              edit={this.state.isSelecting}
              onDrag={this.handleDrag}
            >
              {tiles}
            </Grid>
          ) : (
            <EmptyBoard />
          )}
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

export default injectIntl(Board);
