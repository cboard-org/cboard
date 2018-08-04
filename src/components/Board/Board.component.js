import React, { Component } from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import Grid from '../Grid';
import Symbol from './Symbol';
import OutputContainer from './Output';
import Navbar from './Navbar';
import EditToolbar from './EditToolbar';
import Tile from './Tile';
import EmptyBoard from './EmptyBoard';
import CommunicatorToolbar from '../Communicator/CommunicatorToolbar';

import './Board.css';

export class Board extends Component {
  static propTypes = {
    board: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      tiles: PropTypes.arrayOf(PropTypes.object)
    }),
    /**
     * @ignore
     */
    className: PropTypes.string,
    /**
     *
     */
    disableBackButton: PropTypes.bool,
    /**
     * Callback fired when a board tile is clicked
     */
    onTileClick: PropTypes.func,
    /**
     * Callback fired when board tiles are deleted
     */
    onDeleteTiles: PropTypes.func,
    /**
     *
     */
    onLockNotify: PropTypes.func,
    /**
     * Callback fired when requesting to load previous board
     */
    onRequestPreviousBoard: PropTypes.func,
    /**
     * Callback fired when a board tile is focused
     */
    onFocusTile: PropTypes.func,
    /**
     *
     */
    selectedTileIds: PropTypes.arrayOf(PropTypes.string)
  };

  handleTileClick = tile => {
    const { onTileClick } = this.props;

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

  handleDeleteClick = () => {
    const { onDeleteTiles, board } = this.props;
    this.setState({ selectedTileIds: [] });
    onDeleteTiles(this.props.selectedTileIds, board.id);
  };

  handleBoardKeyUp = event => {
    if (event.keyCode === keycode('esc')) {
      this.handleBackClick();
    }
  };

  renderTiles(tiles) {
    const { selectedTileIds } = this.props;

    return tiles.map(tile => {
      const isSelected = selectedTileIds.includes(tile.id);

      const variant = Boolean(tile.loadBoard) ? 'folder' : 'button';

      return (
        <div key={tile.id}>
          <Tile
            backgroundColor={tile.backgroundColor}
            borderColor={tile.borderColor}
            variant={variant}
            onClick={() => {
              this.handleTileClick(tile);
            }}
            onFocus={() => {
              this.handleTileFocus(tile.id);
            }}
          >
            <Symbol image={tile.image} label={tile.label} />
            {this.props.isSelecting && (
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
      board,
      disableBackButton,
      isLocked,
      isSelecting,
      onAddClick,
      onEditClick,
      onLockClick,
      onLockNotify,
      onSelectClick,
      selectedTileIds
    } = this.props;

    const tiles = this.renderTiles(board.tiles);

    return (
      <div
        className={classNames('Board', {
          'is-locked': this.props.isLocked
        })}
      >
        <div className="Board__output">
          <OutputContainer />
        </div>

        <Navbar
          className="Board__navbar"
          disabled={disableBackButton || isSelecting}
          isLocked={isLocked}
          onBackClick={this.handleBackClick}
          onLockClick={onLockClick}
          onLockNotify={onLockNotify}
          title={board.name}
        />

        <CommunicatorToolbar
          className="Board__communicator-toolbar"
          isSelecting={isSelecting}
        />

        <EditToolbar
          className="Board__edit-toolbar"
          isSelecting={isSelecting}
          onAddClick={onAddClick}
          onDeleteClick={this.handleDeleteClick}
          onEditClick={onEditClick}
          onSelectClick={onSelectClick}
          selectedItemsCount={selectedTileIds.length}
        />

        <div
          className="Board__tiles"
          onKeyUp={this.handleBoardKeyUp}
          ref={ref => {
            this.tiles = ref;
          }}
        >
          {tiles.length ? (
            <Grid id={board.id} edit={isSelecting}>
              {tiles}
            </Grid>
          ) : (
            <EmptyBoard />
          )}
        </div>
      </div>
    );
  }
}

export default Board;
