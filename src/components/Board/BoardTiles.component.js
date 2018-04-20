import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import Grid from '../Grid';
import Tile from './Tile';
import Symbol from './Symbol';
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
     * Callback fired when a board tile is clicked
     */
    onTileClick: PropTypes.func,
    /**
     * Callback fired when a board tile is focused
     */
    onFocusTile: PropTypes.func
  };

  static defaultProps = {
    isSelecting: false,
    selectedTileIds: [],
    tiles: []
  };

  renderTiles() {
    const {
      intl,
      board,
      selectedTileIds,
      isSelecting,
      onTileClick,
      onTileFocus
    } = this.props;

    const { tiles } = board;

    return tiles.map(tile => {
      const isSelected = selectedTileIds.includes(tile.id);
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
              onTileClick(tile);
            }}
            onFocus={() => {
              onTileFocus(tile.id);
            }}
          >
            <Symbol image={tile.image} label={label} />
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
    const { board, isSelecting } = this.props;

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
          <Grid id={board.id} edit={isSelecting} onDrag={this.handleDrag}>
            {tiles}
          </Grid>
        ) : (
          <EmptyBoard />
        )}
      </div>
    );
  }
}

export default injectIntl(Board);
