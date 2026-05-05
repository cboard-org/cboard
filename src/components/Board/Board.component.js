import React, { Component } from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import classNames from 'classnames';
import { Scanner, Scannable } from 'react-scannable';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';

import OutputContainer from './Output';
import Navbar from './Navbar';
import EditToolbar from './EditToolbar';
import CommunicatorToolbar from '../Communicator/CommunicatorToolbar';
import BoardGrid from './BoardGrid/BoardGrid.component';

import { Link } from 'react-router-dom';

import messages from './Board.messages';

import './Board.css';
import BoardTour from './BoardTour/BoardTour';
import ImprovePhraseOutput from './ImprovePhraseOutput';
import { resolveBoardName } from '../../helpers';

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

  handleTileFocus = tileId => {
    const { onFocusTile, board } = this.props;
    onFocusTile(tileId, board.id);
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
      scannerSettings,
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
      totalRows,
      changeDefaultBoard,
      improvedPhrase,
      speak
    } = this.props;

    const isLoggedIn = !!userData.email;

    return (
      <Scanner
        active={scannerSettings.active}
        iterationInterval={scannerSettings.delay}
        strategy={scannerSettings.strategy}
        onDeactivation={deactivateScanner}
      >
        <div
          className={classNames('Board', {
            'is-locked': isLocked
          })}
        >
          <BoardTour
            isLocked={isLocked}
            isRootBoardTourEnabled={isRootBoardTourEnabled}
            isUnlockedTourEnabled={isUnlockedTourEnabled}
            disableTour={disableTour}
            intl={intl}
            onDefaultBoardOptionClick={changeDefaultBoard}
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
            isScannerActive={scannerSettings.active}
            onBackClick={onRequestPreviousBoard}
            onLockClick={onLockClick}
            onDeactivateScannerClick={deactivateScanner}
            onLockNotify={onLockNotify}
            title={resolveBoardName(board, intl)}
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

          <BoardGrid
            board={board}
            displaySettings={this.props.displaySettings}
            navigationSettings={navigationSettings}
            scannerSettings={scannerSettings}
            isSelecting={isSelecting}
            isSaving={isSaving}
            isFixedBoard={isFixedBoard}
            selectedTileIds={selectedTileIds}
            intl={intl}
            onTileClick={this.props.onTileClick}
            onFocusTile={this.handleTileFocus}
            onTileDrop={onTileDrop}
            onLayoutChange={onLayoutChange}
            onAddRemoveRow={onAddRemoveRow}
            onAddRemoveColumn={onAddRemoveColumn}
            onRequestPreviousBoard={onRequestPreviousBoard}
            onRequestToRootBoard={onRequestToRootBoard}
            setIsScroll={setIsScroll}
            isScroll={isScroll}
            totalRows={totalRows}
            boardContainerRef={this.boardContainerRef}
            fixedBoardContainerRef={this.fixedBoardContainerRef}
            navHistory={this.props.navHistory}
          />

          {navigationSettings.improvePhraseActive && (
            <ImprovePhraseOutput
              improvedPhrase={improvedPhrase}
              speak={speak}
            />
          )}
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
