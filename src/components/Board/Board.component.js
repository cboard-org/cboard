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

import Joyride, { STATUS } from 'react-joyride';

import messages from './Board.messages';
import { FormattedMessage } from 'react-intl';

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
    disableTour: PropTypes.func
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
  }

  unlockedHelpSteps = [
    {
      target: 'body',
      placement: 'center',
      hideCloseButton: true,
      content: (
        <h2>
          <FormattedMessage {...messages.walkthroughStart} />
        </h2>
      )
    },
    {
      hideCloseButton: true,
      target: '.personal__account',
      content: <FormattedMessage {...messages.walkthroughSignInUp} />
    },
    {
      hideCloseButton: true,
      target: '.edit__board__ride',
      content: <FormattedMessage {...messages.walkthroughEditBoard} />
    },
    {
      hideCloseButton: true,
      target: '.EditToolbar__BoardTitle',
      content: <FormattedMessage {...messages.walkthroughBoardName} />
    },
    {
      hideCloseButton: true,
      target: '.add__board__tile',
      content: <FormattedMessage {...messages.walkthroughAddTile} />
    },
    {
      hideCloseButton: true,
      target: '.Communicator__title',
      content: <FormattedMessage {...messages.walkthroughChangeBoard} />
    },
    {
      hideCloseButton: true,
      target: '.edit__communicator',
      content: <FormattedMessage {...messages.walkthroughBuildCommunicator} />
    }
  ];

  lockedHelpSteps = [
    {
      target: 'body',
      placement: 'center',
      hideCloseButton: true,
      content: (
        <h2>
          <FormattedMessage {...messages.walkthroughWelcome} />
        </h2>
      )
    },
    {
      hideCloseButton: true,
      target: '.open__lock',
      content: <FormattedMessage {...messages.walkthroughUnlock} />
    }
  ];

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
      disableTour
    } = this.props;

    const tiles = this.renderTiles(board.tiles);
    const cols = DISPLAY_SIZE_GRID_COLS[this.props.displaySettings.uiSize];
    const isLoggedIn = !!userData.email;

    const joyRideStyles = {
      options: {
        arrowColor: '#eee',
        backgroundColor: '#eee',
        primaryColor: '#aa00ff',
        textColor: '#333',
        width: 500,
        zIndex: 1000
      }
    };

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
          {isLocked && isRootBoardTourEnabled && (
            <Joyride
              callback={data => {
                const { status } = data;
                if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
                  if (isRootBoardTourEnabled) {
                    disableTour({ isRootBoardTourEnabled: false });
                  }
                }
              }}
              steps={this.lockedHelpSteps}
              continuous={true}
              showSkipButton={true}
              showProgress={true}
              disableOverlayClose={true}
              run={isRootBoardTourEnabled}
              styles={joyRideStyles}
              locale={{
                last: <FormattedMessage {...messages.walkthroughEndTour} />,
                skip: <FormattedMessage {...messages.walkthroughCloseTour} />,
                next: <FormattedMessage {...messages.walkthroughNext} />,
                back: <FormattedMessage {...messages.walkthroughBack} />
              }}
            />
          )}
          {!isLocked && isUnlockedTourEnabled && (
            <Joyride
              callback={data => {
                const { status } = data;
                if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
                  if (isUnlockedTourEnabled) {
                    disableTour({ isUnlockedTourEnabled: false });
                  }
                }
              }}
              steps={this.unlockedHelpSteps}
              continuous={true}
              showSkipButton={true}
              showProgress={true}
              disableOverlayClose={true}
              run={isUnlockedTourEnabled}
              styles={joyRideStyles}
              locale={{
                last: <FormattedMessage {...messages.walkthroughEndTour} />,
                skip: <FormattedMessage {...messages.walkthroughCloseTour} />,
                next: <FormattedMessage {...messages.walkthroughNext} />,
                back: <FormattedMessage {...messages.walkthroughBack} />
              }}
            />
          )}
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
            <Alert variant="filled" severity="warning">
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
              {!board.isFixed &&
                (tiles.length ? (
                  <Grid
                    board={board}
                    edit={isSelecting && !isSaving}
                    cols={cols}
                    onLayoutChange={onLayoutChange}
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
              />
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
            toRootBoard={onRequestToRootBoard}
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
