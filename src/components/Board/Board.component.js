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
import Alert from '@material-ui/lab/Alert';

import FixedGrid from '../FixedGrid';
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
import EditGridButtons from '../EditGridButtons';
import { DEFAULT_ROWS_NUMBER, DEFAULT_COLUMNS_NUMBER } from './Board.constants';

import { Link } from 'react-router-dom';

import messages from './Board.messages';

import './Board.css';
import BoardTour from './BoardTour/BoardTour';
import ScrollButtons from '../ScrollButtons';
import { NAVIGATION_BUTTONS_STYLE_SIDES } from '../Settings/Navigation/Navigation.constants';

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
     * Callback fired when requesting to travel and load root board
     */
    onRequestToRootBoard: PropTypes.func,
    /**
     *
     */
    selectedTileIds: PropTypes.arrayOf(PropTypes.string),
    displaySettings: PropTypes.object,
    navigationSettings: PropTypes.object,
    scannerSettings: PropTypes.object,
    userData: PropTypes.object,
    deactivateScanner: PropTypes.func,
    navHistory: PropTypes.arrayOf(PropTypes.string),
    emptyVoiceAlert: PropTypes.bool,
    offlineVoiceAlert: PropTypes.bool,
    onBoardTypeChange: PropTypes.func,
    isFixedBoard: PropTypes.bool,
    onAddRemoveColumn: PropTypes.func,
    onAddRemoveRow: PropTypes.func,
    onLayoutChange: PropTypes.func,
    isRootBoardTourEnabled: PropTypes.bool,
    isUnlockedTourEnabled: PropTypes.bool,
    disableTour: PropTypes.func,
    copiedTiles: PropTypes.arrayOf(PropTypes.object),
    setIsScroll: PropTypes.func,
    isScroll: PropTypes.bool,
    totalRows: PropTypes.number
  };

  static defaultProps = {
    displaySettings: {
      uiSize: 'Standard',
      labelPosition: 'Below',
      shareShowActive: false,
      hideOutputActive: false
    },
    navigationSettings: {},
    scannerSettings: { active: false, delay: 2000, strategy: 'automatic' },
    selectedTileIds: [],
    emptyVoiceAlert: false,
    userData: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      openTitleDialog: false,
      titleDialogValue: props.board && props.board.name ? props.board.name : ''
    };

    this.boardContainerRef = React.createRef();
    this.fixedBoardContainerRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.scannerSettings.active) {
      this.props.onScannerActive();
    }
  }

  handleTileClick = tile => {
    const { onTileClick, isSelecting } = this.props;

    if (tile.loadBoard && !isSelecting) {
      const boardComponentRef = this.props.board.isFixed
        ? 'fixedBoardContainerRef'
        : 'boardContainerRef';
      this[boardComponentRef].current.scrollTop = 0;
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

  renderTiles(tiles) {
    const {
      isSelecting,
      isSaving,
      selectedTileIds,
      displaySettings
    } = this.props;

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
            <Symbol
              image={tile.image}
              label={tile.label}
              labelpos={displaySettings.labelPosition}
            />

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

  renderTileFixedBoard(tile) {
    const {
      isSelecting,
      isSaving,
      selectedTileIds,
      displaySettings
    } = this.props;

    const isSelected = selectedTileIds.includes(tile.id);
    const variant = Boolean(tile.loadBoard) ? 'folder' : 'button';

    return (
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
        <Symbol
          image={tile.image}
          label={tile.label}
          labelpos={displaySettings.labelPosition}
        />

        {isSelecting && !isSaving && (
          <div className="CheckCircle">
            {isSelected && <CheckCircleIcon className="CheckCircle__icon" />}
          </div>
        )}
      </Tile>
    );
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
      isFixedBoard,
      onAddClick,
      onDeleteClick,
      onEditClick,
      onSaveBoardClick,
      onSelectAllToggle,
      onSelectClick,
      onLockClick,
      onLockNotify,
      onRequestPreviousBoard,
      onRequestToRootBoard,
      onBoardTypeChange,
      selectedTileIds,
      navigationSettings,
      deactivateScanner,
      publishBoard,
      emptyVoiceAlert,
      offlineVoiceAlert,
      onAddRemoveRow,
      onAddRemoveColumn,
      onTileDrop,
      onLayoutChange,
      isRootBoardTourEnabled,
      isUnlockedTourEnabled,
      disableTour,
      onCopyTiles,
      onPasteTiles,
      setIsScroll,
      isScroll,
      totalRows
    } = this.props;

    const tiles = this.renderTiles(board.tiles);
    const cols = DISPLAY_SIZE_GRID_COLS[this.props.displaySettings.uiSize];
    const isLoggedIn = !!userData.email;
    const isNavigationButtonsOnTheSide =
      navigationSettings.navigationButtonsStyle ===
      NAVIGATION_BUTTONS_STYLE_SIDES;

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
          <BoardTour
            isLocked={isLocked}
            isRootBoardTourEnabled={isRootBoardTourEnabled}
            isUnlockedTourEnabled={isUnlockedTourEnabled}
            disableTour={disableTour}
            intl
          />
          <Scannable>
            <div
              className={classNames('Board__output', {
                hidden: this.props.displaySettings.hideOutputActive
              })}
            >
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
          {emptyVoiceAlert && (
            <Alert variant="filled" severity="error">
              {intl.formatMessage(messages.emptyVoiceAlert)}
            </Alert>
          )}
          {offlineVoiceAlert && (
            <Alert
              variant="filled"
              severity="warning"
              action={
                <Button
                  size="small"
                  variant="outlined"
                  style={{ color: 'white', borderColor: 'white' }}
                  component={Link}
                  to="/settings/speech"
                >
                  {intl.formatMessage(messages.offlineChangeVoice)}
                </Button>
              }
            >
              {intl.formatMessage(messages.offlineVoiceAlert)}
            </Alert>
          )}

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
            isFixedBoard={isFixedBoard}
            onDeleteClick={onDeleteClick}
            onEditClick={onEditClick}
            onSaveBoardClick={onSaveBoardClick}
            onSelectAllToggle={onSelectAllToggle}
            onSelectClick={onSelectClick}
            selectedItemsCount={selectedTileIds.length}
            onBoardTypeChange={onBoardTypeChange}
            onCopyTiles={onCopyTiles}
            onPasteTiles={onPasteTiles}
            copiedTiles={this.props.copiedTiles}
          />

          <Scannable>
            <div
              id="BoardTilesContainer"
              className={classNames(
                'Board__tiles',
                {
                  CABackButtonOnTheSides:
                    navigationSettings.caBackButtonActive &&
                    isNavigationButtonsOnTheSide &&
                    !isSelecting
                },
                {
                  ScrollButtonsOnTheSides:
                    navigationSettings.bigScrollButtonsActive &&
                    isNavigationButtonsOnTheSide
                }
              )}
              onKeyUp={this.handleBoardKeyUp}
              ref={this.boardContainerRef}
            >
              {!board.isFixed &&
                (tiles.length ? (
                  <Grid
                    board={board}
                    edit={isSelecting && !isSaving}
                    cols={cols}
                    onLayoutChange={onLayoutChange}
                    setIsScroll={setIsScroll}
                    isBigScrollBtns={navigationSettings.bigScrollButtonsActive}
                  >
                    {tiles}
                  </Grid>
                ) : (
                  <EmptyBoard />
                ))}

              {board.isFixed && (
                <FixedGrid
                  order={board.grid ? board.grid.order : []}
                  items={board.tiles}
                  columns={
                    board.grid ? board.grid.columns : DEFAULT_COLUMNS_NUMBER
                  }
                  rows={board.grid ? board.grid.rows : DEFAULT_ROWS_NUMBER}
                  dragAndDropEnabled={isSelecting}
                  renderItem={item => this.renderTileFixedBoard(item)}
                  onItemDrop={onTileDrop}
                  fixedRef={this.fixedBoardContainerRef}
                  setIsScroll={setIsScroll}
                  isBigScrollBtns={navigationSettings.bigScrollButtonsActive}
                  isNavigationButtonsOnTheSide={isNavigationButtonsOnTheSide}
                />
              )}

              <EditGridButtons
                active={isFixedBoard && isSelecting && !isSaving ? true : false}
                columns={
                  board.grid ? board.grid.columns : DEFAULT_COLUMNS_NUMBER
                }
                rows={board.grid ? board.grid.rows : DEFAULT_ROWS_NUMBER}
                onAddRemoveRow={onAddRemoveRow}
                onAddRemoveColumn={onAddRemoveColumn}
                moveColsButtonToLeft={
                  navigationSettings.bigScrollButtonsActive &&
                  isNavigationButtonsOnTheSide
                }
              />
            </div>
          </Scannable>

          {navigationSettings.bigScrollButtonsActive && (
            <ScrollButtons
              active={
                navigationSettings.bigScrollButtonsActive &&
                !isSaving &&
                !this.props.scannerSettings.active &&
                (isScroll || isNavigationButtonsOnTheSide)
              }
              isScroll={isScroll}
              isLocked={isLocked}
              boardContainer={
                board.isFixed
                  ? this.fixedBoardContainerRef
                  : this.boardContainerRef
              }
              totalRows={totalRows}
              boardId={board.id}
              isNavigationButtonsOnTheSide={isNavigationButtonsOnTheSide}
            />
          )}

          <NavigationButtons
            active={
              navigationSettings.caBackButtonActive &&
              !isSelecting &&
              !isSaving &&
              !this.props.scannerSettings.active
            }
            navHistory={this.props.navHistory}
            previousBoard={onRequestPreviousBoard}
            toRootBoard={onRequestToRootBoard}
            isLocked={this.props.isLocked}
            isNavigationButtonsOnTheSide={isNavigationButtonsOnTheSide}
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
              <Button
                onClick={this.handleBoardTitleSubmit}
                color="primary"
                variant="contained"
              >
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
