import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Checkbox from 'material-ui/Checkbox';

import Grid from '../Grid';
import Tile from './Tile';
import Symbol from './Symbol';
import EmptyBoard from './EmptyBoard';

import './Board.css';

export class Board extends Component {
  static propTypes = {
    /**
     * TODO: not here, used for Grid
     */
    boardId: PropTypes.string,
    /**
     * Tiles to display
     */
    tiles: PropTypes.arrayOf(PropTypes.object),
    /**
     * Callback fired when a tile is clicked
     */
    onClick: PropTypes.func
  };

  static defaultProps = {
    isSelecting: false,
    selectedTileIds: [],
    boardId: '',
    tiles: []
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.boardId !== nextProps.boardId ||
      this.props.tiles.length !== nextProps.tiles.length ||
      this.props.isSelecting !== nextProps.isSelecting ||
      this.props.selectedTileIds.length !== nextProps.selectedTileIds.length
    ) {
      return true;
    }
    return false;
  }

  renderTiles() {
    const { isSelecting, onClick, selectedTileIds, tiles } = this.props;

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
          >
            <Symbol image={tile.image} label={tile.label} />

            {isSelecting && (
              <div className="CheckCircle">
                <Checkbox checked={isSelected} />
              </div>
              //   {isSelected && (
              //     <CheckCircleIcon className="CheckCircle__icon" />
              //   )}
              // </div>
            )}
          </Tile>
        </div>
      );
    });
  }

  render() {
    const { boardId, isEditing } = this.props;
    const tiles = this.renderTiles();

    return (
      <div className="BoardTiles">
        {tiles.length ? (
          <Grid id={boardId} edit={isEditing}>
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
