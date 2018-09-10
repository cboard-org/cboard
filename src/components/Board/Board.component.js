import React, { Component } from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Scanner, Scannable } from 'react-scannable';

import Grid from '../Grid';
import Symbol from './Symbol';
import OutputContainer from './Output';
import Navbar from './Navbar';
import EditToolbar from './EditToolbar';
import Tile from './Tile';
import EmptyBoard from './EmptyBoard';
import CommunicatorToolbar from '../Communicator/CommunicatorToolbar';
import { DISPLAY_SIZE_GRID_COLS } from '../Settings/Display/Display.constants';
import NavigationButtons from '../NavigationButtons';

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
     * Callback fired when board tiles are deleted
     */
    onDeleteClick: PropTypes.func,
    /**
     * Callback fired when a board tile is focused
     */
    onFocusTile: PropTypes.func,
    /**
     * Callback fired when a board tile is clicked
     */
    onTileClick: PropTypes.func,
    /**
     *
     */
    onLockNotify: PropTypes.func,
    /**
     * Callback fired when requesting to load previous board
     */
    onRequestPreviousBoard: PropTypes.func,
    /**
     *
     */
    selectedTileIds: PropTypes.arrayOf(PropTypes.string),
    displaySettings: PropTypes.object,
    navigationSettings: PropTypes.object,
    scannerSettings: PropTypes.object,
    deactivateScanner: PropTypes.func,
    navHistory: PropTypes.arrayOf(PropTypes.string)
  };

  componentDidMount() {
    setTimeout(() => {
      this.props.onSaveBoardClick();
    }, 2000);
  }

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

  handleBoardKeyUp = event => {
    const { onRequestPreviousBoard } = this.props;

    if (event.keyCode === keycode('esc')) {
      onRequestPreviousBoard();
    }
  };

  renderTiles(tiles) {
    const { isSelecting, selectedTileIds } = this.props;

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

            {isSelecting && (
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
      onDeleteClick,
      onEditClick,
      onSaveBoardClick,
      onLockClick,
      onLockNotify,
      onRequestPreviousBoard,
      onRequestRootBoard,
      onSelectClick,
      selectedTileIds,
      navigationSettings,
      deactivateScanner
    } = this.props;

    const tiles = this.renderTiles(board.tiles);
    const cols = DISPLAY_SIZE_GRID_COLS[this.props.displaySettings.uiSize];

    return (
      <Scanner
        active={this.props.scannerSettings.active}
        iterationInterval={this.props.scannerSettings.delay}
        strategy={this.props.scannerSettings.strategy}
        onDeactivation={deactivateScanner}
      >
        <div
          className={classNames('Board', {
            'is-locked': this.props.isLocked
          })}
        >
          <Scannable>
            <div className="Board__output">
              <OutputContainer />
            </div>
          </Scannable>

          <Navbar
            className="Board__navbar"
            disabled={disableBackButton || isSelecting}
            isLocked={isLocked}
            onBackClick={onRequestPreviousBoard}
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
            onDeleteClick={onDeleteClick}
            onEditClick={onEditClick}
            onSaveBoardClick={onSaveBoardClick}
            onSelectClick={onSelectClick}
            selectedItemsCount={selectedTileIds.length}
          />

          <Scannable>
            <div
              id="BoardTilesContainer"
              className="Board__tiles"
              onKeyUp={this.handleBoardKeyUp}
              ref={ref => {
                this.tiles = ref;
              }}
            >
              {tiles.length ? (
                <Grid id={board.id} edit={isSelecting} cols={cols}>
                  {tiles}
                </Grid>
              ) : (
                <EmptyBoard />
              )}
            </div>
          </Scannable>

          <NavigationButtons
            active={
              navigationSettings.active &&
              !isSelecting &&
              !this.props.scannerSettings.active
            }
            navHistory={this.props.navHistory}
            previousBoard={onRequestPreviousBoard}
            toRootBoard={onRequestRootBoard}
          />
        </div>
      </Scanner>
    );
  }
}

export default Board;
