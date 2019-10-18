import React, { Component } from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Scanner, Scannable } from 'react-scannable';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

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
import messages from './Board.messages';

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
    onSaveBoardClick: PropTypes.func,
    editBoardTitle: PropTypes.func,
    /**
     *
     */
    onLockNotify: PropTypes.func,
    onScannerActive: PropTypes.func,
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
    userData: PropTypes.object,
    deactivateScanner: PropTypes.func,
    navHistory: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    displaySettings: {
      uiSize: 'Standard'
    },
    navigationSettings: {},
    scannerSettings: { active: false, delay: 2000, strategy: 'automatic' },
    selectedTileIds: [],

    userData: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      openTitleDialog: false,
      titleDialogValue: props.board && props.board.name ? props.board.name : ''
    };
  }

  componentDidMount() {
    if (this.props.scannerSettings.active) {
      this.props.onScannerActive();
    }
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

  handleBoardTitleClick = () => {
    if (!this.props.userData.email) {
      return false;
    }
    this.setState({
      openTitleDialog: true,
      titleDialogValue: this.props.board.name
    });
  };

  handleBoardTitleChange = event => {
    const { value: titleDialogValue } = event.target;
    this.setState({ titleDialogValue });
  };

  handleBoardTitleSubmit = async () => {
    if (this.state.titleDialogValue.length) {
      try {
        await this.props.editBoardTitle(this.state.titleDialogValue);
      } catch (e) {}
    }
    this.handleBoardTitleClose();
  };

  handleBoardTitleClose = () => {
    this.setState({
      openTitleDialog: false,
      titleDialogValue: this.props.board.name || this.props.board.id || ''
    });
  };

  updateTiles = tiles => {
    const board = { ...this.props.board, tiles };

    this.props.updateBoard(board);
  };

  renderTiles(tiles) {
    const { isSelecting, isSaving, selectedTileIds } = this.props;

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

            {isSelecting && !isSaving && (
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
      intl,
      userData,
      disableBackButton,
      isLocked,
      isSaving,
      isSelectAll,
      isSelecting,
      onAddClick,
      onDeleteClick,
      onEditClick,
      onSaveBoardClick,
      onSelectAllToggle,
      onSelectClick,
      onLockClick,
      onLockNotify,
      onRequestPreviousBoard,
      onRequestRootBoard,
      selectedTileIds,
      navigationSettings,
      deactivateScanner,
      publishBoard
    } = this.props;

    const tiles = this.renderTiles(board.tiles);
    const cols = DISPLAY_SIZE_GRID_COLS[this.props.displaySettings.uiSize];
    const isLoggedIn = !!userData.email;

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
            disabled={disableBackButton || isSelecting || isSaving}
            isLocked={isLocked}
            isScannerActive={this.props.scannerSettings.active}
            onBackClick={onRequestPreviousBoard}
            onLockClick={onLockClick}
            onDeactivateScannerClick={deactivateScanner}
            onLockNotify={onLockNotify}
            title={board.name}
            board={board}
            userData={userData}
            publishBoard={publishBoard}
            showNotification={this.props.showNotification}
          />

          <CommunicatorToolbar
            className="Board__communicator-toolbar"
            isSelecting={isSelecting || isSaving}
          />

          <EditToolbar
            board={board}
            onBoardTitleClick={this.handleBoardTitleClick}
            className="Board__edit-toolbar"
            isSelectAll={isSelectAll}
            isSelecting={isSelecting}
            isSaving={isSaving}
            isLoggedIn={isLoggedIn}
            onAddClick={onAddClick}
            onDeleteClick={onDeleteClick}
            onEditClick={onEditClick}
            onSaveBoardClick={onSaveBoardClick}
            onSelectAllToggle={onSelectAllToggle}
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
                <Grid
                  board={board}
                  edit={isSelecting && !isSaving}
                  cols={cols}
                  updateTiles={this.updateTiles}
                >
                  {tiles}
                </Grid>
              ) : (
                <EmptyBoard />
              )}
            </div>
          </Scannable>

          <NavigationButtons
            active={
              navigationSettings.caBackButtonActive &&
              !isSelecting &&
              !isSaving &&
              !this.props.scannerSettings.active
            }
            navHistory={this.props.navHistory}
            previousBoard={onRequestPreviousBoard}
            toRootBoard={onRequestRootBoard}
          />

          <Dialog
            open={this.state.openTitleDialog}
            aria-labelledby="board-dialog-title"
            onSubmit={this.handleBoardTitleSubmit}
            onClose={this.handleBoardTitleClose}
          >
            <DialogTitle id="board-dialog-title">
              {intl.formatMessage(messages.editTitle)}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="board title"
                label={intl.formatMessage(messages.boardTitle)}
                type="text"
                fullWidth
                value={this.state.titleDialogValue}
                onChange={this.handleBoardTitleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleBoardTitleClose} color="primary">
                {intl.formatMessage(messages.boardEditTitleCancel)}
              </Button>
              <Button onClick={this.handleBoardTitleSubmit} color="primary">
                {intl.formatMessage(messages.boardEditTitleAccept)}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Scanner>
    );
  }
}

export default Board;
