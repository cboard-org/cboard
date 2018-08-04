import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import {
  showNotification,
  hideNotification
} from '../Notifications/Notifications.actions';

import {
  speak,
  cancelSpeech
} from '../../providers/SpeechProvider/SpeechProvider.actions';

import {
  addBoards,
  changeBoard,
  previousBoard,
  createBoard,
  createTile,
  deleteTiles,
  editTiles,
  focusTile,
  deselectTile,
  selectTile,
  changeOutput,
  deselectAllTiles
} from './Board.actions';

import messages from './Board.messages';
import Board from './Board';
import TileEditor from './TileEditor';
import EditToolBarContainer from './EditToolBar';
import API from '../../api';

export class BoardContainer extends PureComponent {
  static propTypes = {
    /**
     * @ignore
     */
    intl: intlShape.isRequired,
    /**
     * Board history navigation stack
     */
    navHistory: PropTypes.arrayOf(PropTypes.string),
    /**
     * Board to display
     */
    board: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      tiles: PropTypes.arrayOf(PropTypes.object)
    }),
    /**
     * Board output
     */
    output: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        image: PropTypes.string,
        vocalization: PropTypes.string
      })
    ),
    /**
     * Add boards from API
     */
    addBoards: PropTypes.func,
    /**
     * Load board
     */
    changeBoard: PropTypes.func,
    /**
     * Load previous board
     */
    previousBoard: PropTypes.func,
    /**
     * Create board
     */
    createBoard: PropTypes.func,
    /**
     * Create tile
     */
    createTile: PropTypes.func,
    /**
     * Edit tiles
     */
    editTiles: PropTypes.func,
    /**
     * Delete tiles
     */
    deleteTiles: PropTypes.func,
    /**
     * Focuses a board tile
     */
    focusTile: PropTypes.func,
    /**
     * Change output
     */
    changeOutput: PropTypes.func,
    /**
     * Show notification
     */
    showNotification: PropTypes.func
  };

  state = { tileEditorOpen: false };

  async componentWillMount() {
    const {
      match: {
        params: { id }
      },
      history
    } = this.props;

    const { board, boards, communicator, changeBoard, addBoards } = this.props;
    if (!board || board.id !== id) {
      let boardId = communicator.rootBoard;
      const boardExists = boards.find(b => b.id === id);

      if (boardExists) {
        boardId = boardExists.id;
      } else {
        try {
          const boardFromAPI = await API.getBoard(id);
          boardFromAPI.fromAPI = true;
          addBoards([boardFromAPI]);
          boardId = id;
        } catch (e) {}
      }

      changeBoard(boardId);
      const goTo = id ? boardId : `board/${boardId}`;
      history.replace(goTo);
    } else {
      if (!id || id !== board.id) {
        const goTo = id ? board.id : `board/${board.id}`;
        history.replace(goTo);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      const { navHistory } = this.props;
      this.props.changeBoard(nextProps.match.params.id);

      // Was a browser back action?
      if (
        navHistory.length >= 2 &&
        nextProps.match.params.id === navHistory[navHistory.length - 2]
      ) {
        this.props.previousBoard();
      }
    }
  }

  toggleTileSelect(id) {
    const { selectTile, deselectTile, selectedTileIds } = this.props;
    const isTileSelected = selectedTileIds.includes(id);

    if (isTileSelected) {
      deselectTile(id);
    } else {
      selectTile(id);
    }
  }

  showTileEditor = () => {
    this.setState({ tileEditorOpen: true });
  };

  hideTileEditor = () => {
    this.setState({ tileEditorOpen: false });
  };

  handleTileClick = tile => {
    const { changeBoard, changeOutput, isSelecting, speak } = this.props;
    const hasAction = tile.action && tile.action.startsWith('+');

    if (isSelecting) {
      this.toggleTileSelect(tile.id);
      return;
    }

    if (tile.loadBoard) {
      changeBoard(tile.loadBoard);
      this.props.history.push(tile.loadBoard);
    } else {
      changeOutput([...this.props.output, tile]);
      const toSpeak = !hasAction ? tile.vocalization || tile.label : null;
      if (toSpeak) {
        speak(toSpeak);
      }
    }
  };

  handleAddTile = tile => {
    const { intl, createTile, showNotification } = this.props;
    createTile(tile);
    showNotification(intl.formatMessage(messages.tilesCreated));
  };

  handleLockNotify = countdown => {
    const { intl, showNotification, hideNotification } = this.props;

    if (countdown > 2) {
      return;
    }

    if (!countdown) {
      hideNotification();
      return;
    }

    const clicksToUnlock = `${countdown} ${intl.formatMessage(
      messages.clicksToUnlock
    )}`;

    hideNotification();
    // HACK: refactor Notification container
    setTimeout(() => {
      showNotification(clicksToUnlock);
    });
  };

  handleEditTileEditorSubmit = tiles => {
    const { editTiles, deselectAllTiles } = this.props;
    deselectAllTiles();
    editTiles(tiles);
  };

  handleAddTileEditorSubmit = tile => {
    const { createBoard } = this.props;

    if (tile.loadBoard) {
      const {
        loadBoard: boardId,
        label: boardName,
        labelKey: boardNameKey
      } = tile;

      createBoard(boardId, boardName, boardNameKey);
    }
    this.handleAddTile(tile);
  };

  onRequestPreviousBoard() {
    this.props.history.goBack();
    this.props.previousBoard();
  }

  render() {
    const {
      navHistory,
      board,
      focusTile,
      isSelecting,
      match: {
        params: { id }
      },
      selectedTileIds
    } = this.props;

    if (!board || board.id !== id) {
      return null;
    }

    const disableBackButton = navHistory.length === 1;

    const editingTiles = this.props.selectedTileIds.map(
      selectedTileId =>
        board.tiles.filter(tile => {
          return tile.id === selectedTileId;
        })[0]
    );

    return (
      <Fragment>
        <Board
          disableBackButton={disableBackButton}
          board={board}
          selectedTileIds={selectedTileIds}
          isSelecting={isSelecting}
          onLockNotify={this.handleLockNotify}
          onTileClick={this.handleTileClick}
          onRequestPreviousBoard={this.onRequestPreviousBoard.bind(this)}
          onFocusTile={focusTile}
          editToolBar={
            <EditToolBarContainer
              onEditClick={this.showTileEditor}
              onCreateClick={this.showTileEditor}
            />
          }
        />

        <TileEditor
          editingTiles={editingTiles}
          open={this.state.tileEditorOpen}
          onClose={this.hideTileEditor}
          onEditSubmit={this.handleEditTileEditorSubmit}
          onAddSubmit={this.handleAddTileEditorSubmit}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = ({ board, communicator, language }) => {
  const activeCommunicatorId = communicator.activeCommunicatorId;
  const currentCommunicator = communicator.communicators.find(
    communicator => communicator.id === activeCommunicatorId
  );

  const activeBoardId = board.activeBoardId;
  const currentBoard = board.boards.find(board => board.id === activeBoardId);

  return {
    communicator: currentCommunicator,
    board: currentBoard,
    boards: board.boards,
    isSelecting: board.tileSelectable,
    navHistory: board.navHistory,
    output: board.output,
    selectedTileIds: board.selectedTileIds
  };
};

const mapDispatchToProps = {
  addBoards,
  changeBoard,
  previousBoard,
  createBoard,
  createTile,
  deleteTiles,
  editTiles,
  deselectAllTiles,
  deselectTile,
  selectTile,
  focusTile,
  changeOutput,
  speak,
  cancelSpeech,
  showNotification,
  hideNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(BoardContainer));
