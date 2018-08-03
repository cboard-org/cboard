import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import keycode from 'keycode';
import classNames from 'classnames';

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
     * Board to display
     */
    board: PropTypes.shape({
      tiles: PropTypes.arrayOf(
        PropTypes.shape({
          backgroundColor: PropTypes.string,
          borderColor: PropTypes.string,
          id: PropTypes.string.isRequired,
          image: PropTypes.string,
          label: PropTypes.string,
          loadBoard: PropTypes.string
        })
      ).isRequired
    }).isRequired,
    /**
     * @ignore
     */
    className: PropTypes.string,
    /**
     * If true, navigation of boards will be disabled
     */
    disableNav: PropTypes.bool,
    /**
     * @ignore
     */
    intl: intlShape.isRequired,
    /**
     * Callback fired when a board tile is clicked
     */
    onTileClick: PropTypes.func,
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

  handleTileFocus = tileId => {
    const { onFocusTile, board } = this.props;
    onFocusTile(tileId, board.id);
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
    const { onRequestPreviousBoard } = this.props;

    if (event.keyCode === keycode('esc')) {
      onRequestPreviousBoard();
    }
  };

  renderTile = tile => {
    const { intl, onTileClick, selectedTileIds, isSelecting } = this.props;

    const label = tile.labelKey
      ? intl.formatMessage({ id: tile.labelKey })
      : tile.label;

    const translatedTile = { ...tile, label };

    const variant = Boolean(tile.loadBoard) ? 'folder' : 'button';
    const isTileSelected = selectedTileIds.includes(tile.id);

    let checkboxIcon = null;

    if (isSelecting) {
      const iconStyle = {
        display: 'block',
        margin: '8px',
        background: '#fff'
      };

      checkboxIcon = isTileSelected ? (
        <CheckBoxIcon style={iconStyle} />
      ) : (
        <CheckBoxOutlineBlankIcon style={iconStyle} />
      );
    }

    return (
      <Tile
        backgroundColor={tile.backgroundColor}
        borderColor={tile.borderColor}
        icon={checkboxIcon}
        key={tile.id}
        onClick={() => {
          onTileClick(translatedTile);
        }}
        variant={variant}
      >
        <Symbol label={translatedTile.label} image={tile.image} />
      </Tile>
    );
  };

  render() {
    const {
      intl,
      disableBackButton,
      board,
      editToolBar,
      onRequestPreviousBoard
    } = this.props;

    const boardName = board.nameKey
      ? intl.formatMessage({ id: board.nameKey })
      : board.name;

    const tiles = board.tiles.map(tile => this.renderTile(tile));

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
          onBackClick={onRequestPreviousBoard}
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
