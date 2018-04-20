import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import Grid from '../Grid';
import Tile from './Tile';
import Symbol from './Symbol';
import EmptyBoard from './EmptyBoard';

import './Board.css';

export class Board extends Component {
  static propTypes = {
    /**
     * Board to display
     */
    board: PropTypes.shape({
      id: PropTypes.string,
      tiles: PropTypes.arrayOf(PropTypes.object)
    }),
    /**
     * Callback fired when a tile is clicked
     */
    onClick: PropTypes.func,
    /**
     * Callback fired when a tile is focused
     */
    onFocus: PropTypes.func
  };

  static defaultProps = {
    isSelecting: false,
    selectedTileIds: [],
    board: {}
  };

  translateBoard() {
    const { board, intl } = this.props;
    const translatedBoard = { ...board };

    translatedBoard.name = board.nameKey
      ? intl.formatMessage({ id: board.nameKey })
      : board.label;

    translatedBoard.tiles = board.tiles.map(tile => {
      const label = tile.labelKey
        ? intl.formatMessage({ id: tile.labelKey })
        : tile.label;

      return { ...tile, label };
    });

    return translatedBoard;
  }

  renderTiles() {
    const {
      tiles,
      selectedTileIds,
      isSelecting,
      onClick,
      onFocus
    } = this.props;

    return tiles.map(tile => {
      const isSelected = selectedTileIds.includes(tile.id);
      const variant = Boolean(tile.loadBoard) ? 'folder' : 'tile';

      return (
        <div key={tile.id}>
          <Tile
            backgroundColor={tile.backgroundColor}
            variant={variant}
            onClick={() => {
              onClick(tile);
            }}
            onFocus={() => {
              onFocus(tile.id);
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
    const { boardId, isSelecting } = this.props;
    const tiles = this.renderTiles();

    return (
      <div
        className="BoardTiles"
        onKeyUp={this.handleBoardKeyUp}
        ref={ref => {
          this.tiles = ref;
        }}
      >
        {tiles.length ? (
          <Grid id={boardId} edit={isSelecting} onDrag={this.handleDrag}>
            {tiles}
          </Grid>
        ) : (
          <EmptyBoard />
        )}
      </div>
    );
  }
}

export default Board;
