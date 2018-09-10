import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import domtoimage from 'dom-to-image';
import {
  showNotification,
  hideNotification
} from '../Notifications/Notifications.actions';
import { deactivateScanner } from '../../providers/ScannerProvider/ScannerProvider.actions';
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
  changeOutput
} from './Board.actions';
import TileEditor from './TileEditor';
import messages from './Board.messages';
import Board from './Board.component';
import API from '../../api';
import { dataURLtoFile } from './Board.helpers';

export class BoardContainer extends Component {
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
    showNotification: PropTypes.func,
    deactivateScanner: PropTypes.func,
    displaySettings: PropTypes.object,
    navigationSettings: PropTypes.object,
    scannerSettings: PropTypes.object
  };

  state = {
    selectedTileIds: [],
    isSelecting: false,
    isLocked: true,
    tileEditorOpen: false,
    translatedBoard: null
  };

  async componentWillMount() {
    const {
      match: {
        params: { id }
      },
      history
    } = this.props;

    const { board, boards, communicator, changeBoard, addBoards } = this.props;
    if (!board || (id && board.id !== id)) {
      let boardId = communicator.rootBoard;
      const boardExists = boards.find(b => b.id === id);

      if (boardExists) {
        boardId = boardExists.id;
      } else if (id) {
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

  componentDidMount() {
    const { board } = this.props;
    const translatedBoard = this.translateBoard(board);
    this.setState({ translatedBoard });
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

    // TODO: perf issues
    const translatedBoard = this.translateBoard(nextProps.board);
    this.setState({ translatedBoard });
  }

  toggleSelectMode() {
    this.setState(prevState => ({
      isSelecting: !prevState.isSelecting,
      selectedTileIds: []
    }));
  }

  selectTile(tileId) {
    this.setState({
      selectedTileIds: [...this.state.selectedTileIds, tileId]
    });
  }

  deselectTile(tileId) {
    const [...selectedTileIds] = this.state.selectedTileIds;
    const tileIndex = selectedTileIds.indexOf(tileId);
    selectedTileIds.splice(tileIndex, 1);
    this.setState({ selectedTileIds });
  }

  toggleTileSelect(tileId) {
    if (this.state.selectedTileIds.includes(tileId)) {
      this.deselectTile(tileId);
    } else {
      this.selectTile(tileId);
    }
  }

  translateBoard(board) {
    if (!board) {
      return null;
    }

    const { intl } = this.props;

    const name = board.nameKey
      ? intl.formatMessage({ id: board.nameKey })
      : board.name;

    const tiles = board.tiles.map(tile => ({
      ...tile,
      label: tile.labelKey
        ? intl.formatMessage({ id: tile.labelKey })
        : tile.label
    }));

    const translatedBoard = {
      ...board,
      name,
      tiles
    };

    return translatedBoard;
  }

  async captureBoardScreenshot() {
    const node = document.getElementById('BoardTilesContainer').firstChild;
    let dataURL = null;
    try {
      dataURL = await domtoimage.toPng(node);
    } catch (e) {}

    return dataURL;
  }

  async uploadBoardScreenshot(dataURL) {
    const filename = `${this.state.translatedBoard.name ||
      this.state.translatedBoard.id}.png`;
    const file = dataURLtoFile(dataURL, filename);

    let url = null;
    try {
      url = await API.uploadFile(file, filename);
    } catch (e) {}

    return url;
  }

  async updateBoardScreenshot() {
    let url = null;
    const dataURL = await this.captureBoardScreenshot();
    if (dataURL) {
      url = await this.uploadBoardScreenshot(dataURL);
    }

    return url;
  }

  handleSaveBoardClick = async () => {
    const { userData } = this.props;

    let boardData = this.state.translatedBoard;
    let action = 'updateBoard';
    if (boardData.email !== userData.email) {
      const { email, name: author } = userData;
      boardData = {
        ...this.state.translatedBoard,
        email,
        author,
        isPublic: false
      };
      action = 'createBoard';
    }

    const caption = await this.updateBoardScreenshot();
    if (caption) {
      boardData.caption = caption;
    }

    boardData.locale = this.props.intl.locale;

    const boardResponse = await API[action](boardData);

    debugger;
  };

  handleEditClick = () => {
    this.setState({ tileEditorOpen: true });
  };

  handleTileEditorCancel = () => {
    this.setState({ tileEditorOpen: false });
  };

  handleEditTileEditorSubmit = tiles => {
    const { board, editTiles } = this.props;
    editTiles(tiles, board.id);
    this.toggleSelectMode();
  };

  handleAddTileEditorSubmit = tile => {
    const { createTile, createBoard, board } = this.props;

    if (tile.loadBoard) {
      const {
        loadBoard: boardId,
        label: boardName,
        labelKey: boardNameKey
      } = tile;

      createBoard(boardId, boardName, boardNameKey);
    }
    createTile(tile, board.id);
  };

  handleAddClick = () => {
    this.setState({
      tileEditorOpen: true,
      selectedTileIds: [],
      isSelecting: false
    });
  };

  handleLockClick = () => {
    this.setState((state, props) => ({
      isLocked: !state.isLocked,
      isSelecting: false,
      selectedTileIds: []
    }));
  };

  handleSelectClick = () => {
    this.toggleSelectMode();
  };

  handleTileClick = tile => {
    if (this.state.isSelecting) {
      this.toggleTileSelect(tile.id);
      return;
    }

    const { changeBoard, changeOutput, speak } = this.props;
    const hasAction = tile.action && tile.action.startsWith('+');

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

  handleAddTile = (tile, boardId) => {
    const { intl, createTile, showNotification } = this.props;
    createTile(tile, boardId);
    showNotification(intl.formatMessage(messages.tilesCreated));
  };

  handleDeleteClick = () => {
    const { intl, deleteTiles, showNotification, board } = this.props;
    deleteTiles(this.state.selectedTileIds, board.id);
    this.setState({ selectedTileIds: [] });
    showNotification(intl.formatMessage(messages.tilesDeleted));
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

  onRequestPreviousBoard() {
    this.props.history.goBack();
    this.props.previousBoard();
  }

  onRequestRootBoard() {
    const count = this.props.navHistory.length - 1;
    for (let i = 0; i < count; i++) {
      this.onRequestPreviousBoard();
    }
  }

  render() {
    const {
      navHistory,
      board,
      focusTile,
      match: {
        params: { id }
      }
    } = this.props;

    if (!this.state.translatedBoard || board.id !== id) {
      return null;
    }

    const disableBackButton = navHistory.length === 1;
    const editingTiles = this.state.tileEditorOpen
      ? this.state.selectedTileIds.map(selectedTileId => {
          const tiles = board.tiles.filter(tile => {
            return tile.id === selectedTileId;
          })[0];

          return tiles;
        })
      : [];

    return (
      <Fragment>
        <Board
          board={this.state.translatedBoard}
          scannerSettings={this.props.scannerSettings}
          deactivateScanner={this.props.deactivateScanner}
          disableBackButton={disableBackButton}
          isLocked={this.state.isLocked}
          isSelecting={this.state.isSelecting}
          onAddClick={this.handleAddClick}
          onDeleteClick={this.handleDeleteClick}
          onEditClick={this.handleEditClick}
          onSaveBoardClick={this.handleSaveBoardClick}
          onFocusTile={focusTile}
          onLockClick={this.handleLockClick}
          onLockNotify={this.handleLockNotify}
          onRequestPreviousBoard={this.onRequestPreviousBoard.bind(this)}
          onRequestRootBoard={this.onRequestRootBoard.bind(this)}
          onSelectClick={this.handleSelectClick}
          onTileClick={this.handleTileClick}
          selectedTileIds={this.state.selectedTileIds}
          displaySettings={this.props.displaySettings}
          navigationSettings={this.props.navigationSettings}
          navHistory={this.props.navHistory}
        />
        <TileEditor
          editingTiles={editingTiles}
          open={this.state.tileEditorOpen}
          onClose={this.handleTileEditorCancel}
          onEditSubmit={this.handleEditTileEditorSubmit}
          onAddSubmit={this.handleAddTileEditorSubmit}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = ({
  board,
  communicator,
  language,
  scanner,
  app: { displaySettings, navigationSettings, userData }
}) => {
  const activeCommunicatorId = communicator.activeCommunicatorId;
  const currentCommunicator = communicator.communicators.find(
    communicator => communicator.id === activeCommunicatorId
  );

  const activeBoardId = board.activeBoardId;

  return {
    communicator: currentCommunicator,
    board: board.boards.find(board => board.id === activeBoardId),
    boards: board.boards,
    output: board.output,
    scannerSettings: scanner,
    navHistory: board.navHistory,
    displaySettings,
    navigationSettings,
    userData
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
  focusTile,
  changeOutput,
  speak,
  cancelSpeech,
  showNotification,
  hideNotification,
  deactivateScanner
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(BoardContainer));
