import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import keycode from 'keycode';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import Grid from '../Grid';
import Symbol from './Symbol';
import OutputContainer from './Output';
import Navbar from './Navbar';
import Tile from './Tile';
import EmptyBoard from './EmptyBoard';
import CommunicatorToolbar from '../Communicator/CommunicatorToolbar';

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
    onFocusTile: PropTypes.func
  };

  state = {
    isLocked: true
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

  handleLockClick = () => {
    this.setState((state, props) => ({
      isLocked: !state.isLocked
    }));
  };

  handleLockNotify = countdown => {
    const { onLockNotify } = this.props;
    onLockNotify(countdown);
  };

  handleBoardKeyUp = event => {
    if (event.keyCode === keycode('esc')) {
      this.handleBackClick();
    }
  };

  renderTiles(tiles, boardId) {
    const { intl } = this.props;

    return Object.keys(tiles).map((id, index) => {
      const tile = tiles[id];
      const isSelected = this.props.selectedTileIds.includes(tile.id);

      const label = tile.labelKey
        ? intl.formatMessage({ id: tile.labelKey })
        : tile.label;
      tile.label = label;
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
            <Symbol image={tile.image} label={label} />
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
    const { intl, disableBackButton, board, editToolBar } = this.props;

    const boardName = board.nameKey
      ? intl.formatMessage({ id: board.nameKey })
      : board.name;

    const tiles = this.renderTiles(board.tiles, board.id);

    return (
      <div
        className={classNames('Board', {
          'is-locked': this.state.isLocked
        })}
      >
        <div className="Board__output">
          <OutputContainer />
        </div>

        <Navbar
          className="Board__navbar"
          title={boardName}
          disabled={disableBackButton || this.props.isSelecting}
          isLocked={this.state.isLocked}
          onBackClick={this.handleBackClick}
          onLockClick={this.handleLockClick}
          onLockNotify={this.handleLockNotify}
        />

        <CommunicatorToolbar
          className="Board__communicator-toolbar"
          isSelecting={this.props.isSelecting}
        />

        <div className="Board__edit-toolbar">{editToolBar}</div>

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
              edit={this.props.isSelecting}
              onDrag={this.handleDrag}
            >
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

export default injectIntl(Board);
