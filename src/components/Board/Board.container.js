import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import shortid from 'shortid';
import { injectIntl, intlShape } from 'react-intl';
import isMobile from 'ismobilejs';
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
  replaceBoard,
  previousBoard,
  createBoard,
  updateBoard,
  createTile,
  deleteTiles,
  editTiles,
  focusTile,
  changeOutput,
  historyRemovePreviousBoard,
  updateApiObjects,
  updateApiObjectsNoChild,
  getApiObjects,
  deleteApiBoard
} from './Board.actions';
import {
  upsertCommunicator,
  changeCommunicator,
  addBoardCommunicator,
  deleteBoardCommunicator
} from '../Communicator/Communicator.actions';
import TileEditor from './TileEditor';
import messages from './Board.messages';
import Board from './Board.component';
import API from '../../api';
import {
  SCANNING_METHOD_AUTOMATIC,
  SCANNING_METHOD_MANUAL
} from '../Settings/Scanning/Scanning.constants';
import { NOTIFICATION_DELAY } from '../Notifications/Notifications.constants';

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
    historyRemovePreviousBoard: PropTypes.func,
    /**
     * Create board
     */
    createBoard: PropTypes.func,
    updateBoard: PropTypes.func,
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
    /**
     * Deactivate Scanner
     */
    deactivateScanner: PropTypes.func,
    /**
     * Show display Settings
     */
    displaySettings: PropTypes.object,
    /**
     * Show navigationSettings
     */
    navigationSettings: PropTypes.object,
    /**
     * Show userData
     */
    userData: PropTypes.object,
    /**
     * Scanner Settings
     */
    scannerSettings: PropTypes.object,
    /**
     * Adds a Board to the Active Communicator
     */
    addBoardCommunicator: PropTypes.func.isRequired,
    /**
   * Deletes a Board from the Active Communicator
   */
    deleteBoardCommunicator: PropTypes.func.isRequired
  };

  state = {
    selectedTileIds: [],
    isSaving: false,
    isSelectAll: false,
    isSelecting: false,
    isLocked: true,
    tileEditorOpen: false,
    translatedBoard: null,
    newOwnBoard: null,
    isApiRequired: false
  };

  async componentWillMount() {
    const {
      match: {
        params: { id }
      },
      history
    } = this.props;

    const { board, boards, communicator, changeBoard, addBoards, userData } = this.props;

    // Loggedin user?
    if ('name' in userData && 'email' in userData) {
      //synchronize communicator and boards with API
      this.props.getApiObjects();
    }
    
    if (!board || (id && board.id !== id)) {
      let boardId = id || communicator.rootBoard;
      const boardExists = boards.find(b => b.id === boardId);
      if (boardExists) {
        boardId = boardExists.id;
      } else if (boardId) {
        try {
          const boardFromAPI = await API.getBoard(boardId);
          boardFromAPI.fromAPI = true;
          addBoards([boardFromAPI]);
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
      isSelectAll: false,
      selectedTileIds: []
    }));
  }

  selectAllTiles() {
    const { board } = this.props;
    const allTileIds = board.tiles.map(tile => tile.id);

    this.setState({
      selectedTileIds: allTileIds
    });
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

  async updateBoardScreenshot() {
    let url = null;
    const dataURL = await this.captureBoardScreenshot();
    if (dataURL && dataURL !== 'data:,') {
      const filename = `${this.state.translatedBoard.name ||
        this.state.translatedBoard.id}.png`;
      url = await API.uploadFromDataURL(dataURL, filename);
    }

    return url;
  }

  playAudio(src) {
    let audio = new Audio();
    audio.src = src;
    audio.play();
  }

  handleEditBoardTitle = async name => {};

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
    this.setState({
      isApiRequired: true
    });
  };

  handleAddTileEditorSubmit = tile => {
    const { userData, createTile, board } = this.props;
    const boardData = {
      id: tile.loadBoard,
      name: tile.label,
      nameKey: tile.labelKey,
      tiles: [],
      isPublic: false
    };
    if (tile.loadBoard) {
      this.props.createBoard(boardData);
    }
    createTile(tile, board.id);

    // Loggedin user?
    if ('name' in userData && 'email' in userData) {
      this.setState({
        isApiRequired: true
      });
      //update new board to be an own board
      if (tile.loadBoard) {
        this.setState({
          newOwnBoard: {
            ...boardData,
            author: userData.name,
            email: userData.email,
            locale: userData.locale,
            caption: tile.image
          }
        });
      }
    }
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
      isSaving: false,
      isSelecting: false,
      selectedTileIds: []
    }));
  };

  handleSelectClick = () => {
    this.toggleSelectMode();
  };

  handleSelectAllToggle = () => {
    if (this.state.isSelectAll) {
      this.setState({ selectedTileIds: [] });
    } else {
      this.selectAllTiles();
    }

    this.setState(prevState => ({
      isSelectAll: !prevState.isSelectAll
    }));
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

      if (tile.sound) {
        this.playAudio(tile.sound);
      } else {
        const toSpeak = !hasAction ? tile.vocalization || tile.label : null;
        if (toSpeak) {
          speak(toSpeak);
        }
      }
    }
  };

  handleAddTile = (tile, boardId) => {
    const { intl, createTile, showNotification } = this.props;
    createTile(tile, boardId);
    showNotification(intl.formatMessage(messages.tilesCreated));
  };

  handleDeleteClick = () => {
    const { intl, deleteTiles, showNotification, board, userData, communicator } = this.props;
    deleteTiles(this.state.selectedTileIds, board.id);
    this.setState({
      selectedTileIds: [],
      isApiRequired: true
    });
    showNotification(intl.formatMessage(messages.tilesDeleted));

    // Loggedin user?
    if ('name' in userData && 'email' in userData) {
      for (let i = 0; i < this.state.selectedTileIds.length; i++) {
        for (let j = 0; j < board.tiles.length; j++) {
          if (board.tiles[j].id === this.state.selectedTileIds[i] &&
            board.tiles[j].hasOwnProperty('loadBoard') &&
            board.tiles[j].loadBoard &&
            board.tiles[j].loadBoard.length > 14) {
            if (board.tiles[j].loadBoard !== communicator.rootBoard) {
              this.props.deleteBoardCommunicator(board.tiles[j].loadBoard);
              this.props.deleteApiBoard(board.tiles[j].loadBoard);
            } else {
              showNotification(intl.formatMessage(messages.rootBoardNotDeleted));
            }
          }
        }
      }
    }
  };

  handleLockNotify = countdown => {
    const { intl, showNotification, hideNotification } = this.props;

    if (countdown > 3) {
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

  handleScannerStrategyNotification = () => {
    const {
      scannerSettings: { strategy },
      showNotification,
      intl
    } = this.props;
    const messagesKeyMap = {
      [SCANNING_METHOD_MANUAL]: messages.scannerManualStrategy,
      [SCANNING_METHOD_AUTOMATIC]: messages.scannerAutomaticStrategy
    };
    showNotification(intl.formatMessage(messagesKeyMap[strategy]));

    if (!isMobile.any) {
      setTimeout(() => {
        showNotification(intl.formatMessage(messages.scannerHowToDeactivate));
      }, NOTIFICATION_DELAY);
    }
  };

  handleUpdateBoard = board => {
    this.props.replaceBoard(this.props.board, board);
    const { userData, communicator } = this.props;

    // Loggedin user?
    if (this.state.isApiRequired && 'name' in userData && 'email' in userData) {
      this.setState({
        isSaving: true,
        isApiRequired: false
      });

      var createCommunicator = false;
      var createParentBoard = false;
      var createChildBoard = false;
      var childBoardData = null;

      const communicatorData = {
        ...communicator,
        author: userData.name,
        email: userData.email,
        id: shortid.generate(),
        boards: []
      };
      const parentBoardData = {
        ...board,
        author: userData.name,
        email: userData.email,
        locale: userData.locale,
        isPublic: false
      };

      //check if user has an own communicator
      if (communicator.email !== userData.email) {
        this.props.upsertCommunicator(communicatorData);
        this.props.changeCommunicator(communicatorData.id);
        createCommunicator = true;
      }
      //check for a new  own board
      if (this.state.newOwnBoard) {
        childBoardData = { ...this.state.newOwnBoard };
        this.setState({
          newOwnBoard: null
        });
        createChildBoard = true;
        this.props.updateBoard(childBoardData);
        this.props.addBoardCommunicator(childBoardData.id);
      }
      //check if we have to create a copy of the parent
      if (board.isPublic &&
        board.email !== userData.email) {
        if (communicatorData.rootBoard === board.id) {
          parentBoardData.id = shortid.generate();
          this.props.createBoard(parentBoardData);
          this.props.addBoardCommunicator(parentBoardData.id);
          createParentBoard = true;
          //parent board needs to be the root board
          communicatorData.rootBoard = parentBoardData.id;
          communicatorData.activeBoardId = parentBoardData.id;
          this.props.upsertCommunicator(communicatorData);
        } else {
          //update the parent
          this.props.updateBoard(parentBoardData);
          this.props.addBoardCommunicator(parentBoardData.id);
          if (parentBoardData.id.length < 15) {
            createParentBoard = true; 
          }
          //if it is a new communicator , need to set as root 
          if (createCommunicator === true) {
            communicatorData.rootBoard = parentBoardData.id;
            communicatorData.activeBoardId = parentBoardData.id;
            this.props.upsertCommunicator(communicatorData);
          }
        }
      }
      //api updates
        if (!createChildBoard) {
          this.props
            .updateApiObjectsNoChild(
              parentBoardData,
              createCommunicator,
              createParentBoard
            )
            .then(parentBoardId => {
              if (createParentBoard) {
                this.props.historyRemovePreviousBoard(parentBoardId);
              }
              this.props.history.replace(`/board/${parentBoardId}`);
              this.setState({ isSaving: false });
            })
            .catch(e => {
              this.setState({ isSaving: false });
            });

        } else {
          this.props
            .updateApiObjects(
              childBoardData,
              parentBoardData,
              createCommunicator,
              createParentBoard
            )
            .then(parentBoardId => {
              if (createParentBoard) {
                this.props.historyRemovePreviousBoard(parentBoardId);
              }
              this.props.history.replace(`/board/${parentBoardId}`);
              this.setState({ isSaving: false });
            })
            .catch(e => {
              this.setState({ isSaving: false });
            });
        }
    }
  };

  onRequestPreviousBoard() {
    if (this.props.navHistory.length >= 2) {
      const prevBoardId = this.props.navHistory[
        this.props.navHistory.length - 2
      ];
      this.props.history.replace(`/board/${prevBoardId}`);
    }
  }

  onRequestRootBoard() {
    const count = this.props.navHistory.length - 1;
    for (let i = 0; i < count; i++) {
      this.onRequestPreviousBoard();
    }
  }

  publishBoard = async () => {
    const boardData = {
      ...this.props.board,
      isPublic: !this.props.board.isPublic
    };

    const boardResponse = await API.updateBoard(boardData);

    this.props.replaceBoard(this.props.board, boardResponse);
  };

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
          userData={this.props.userData}
          isLocked={this.state.isLocked}
          isSaving={this.state.isSaving}
          isSelecting={this.state.isSelecting}
          isSelectAll={this.state.isSelectAll}
          updateBoard={this.handleUpdateBoard}
          onAddClick={this.handleAddClick}
          onDeleteClick={this.handleDeleteClick}
          onEditClick={this.handleEditClick}
          onSelectAllToggle={this.handleSelectAllToggle}
          onFocusTile={focusTile}
          onLockClick={this.handleLockClick}
          onLockNotify={this.handleLockNotify}
          onScannerActive={this.handleScannerStrategyNotification}
          onRequestPreviousBoard={this.onRequestPreviousBoard.bind(this)}
          onRequestRootBoard={this.onRequestRootBoard.bind(this)}
          onSelectClick={this.handleSelectClick}
          onTileClick={this.handleTileClick}
          editBoardTitle={this.handleEditBoardTitle}
          selectedTileIds={this.state.selectedTileIds}
          displaySettings={this.props.displaySettings}
          navigationSettings={this.props.navigationSettings}
          navHistory={this.props.navHistory}
          publishBoard={this.publishBoard}
          showNotification={this.props.showNotification}
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
  replaceBoard,
  previousBoard,
  historyRemovePreviousBoard,
  createBoard,
  updateBoard,
  createTile,
  deleteTiles,
  editTiles,
  focusTile,
  changeOutput,
  speak,
  cancelSpeech,
  showNotification,
  hideNotification,
  deactivateScanner,
  upsertCommunicator,
  changeCommunicator,
  addBoardCommunicator,
  deleteBoardCommunicator,
  updateApiObjects,
  updateApiObjectsNoChild,
  getApiObjects,
  deleteApiBoard
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(BoardContainer));
