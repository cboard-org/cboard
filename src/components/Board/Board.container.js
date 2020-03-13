import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import shortid from 'shortid';
import { injectIntl, intlShape } from 'react-intl';
import isMobile from 'ismobilejs';
import domtoimage from 'dom-to-image';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
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
  switchBoard,
  createTile,
  deleteTiles,
  editTiles,
  focusTile,
  clickSymbol,
  changeOutput,
  historyRemoveBoard,
  updateApiObjects,
  updateApiObjectsNoChild,
  getApiObjects,
  deleteApiBoard,
  downloadImages,
  updateApiBoard
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
import { isCordova } from '../../cordova-util';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
    historyRemoveBoard: PropTypes.func,
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
    deleteBoardCommunicator: PropTypes.func.isRequired,
    downloadImages: PropTypes.func
  };

  state = {
    selectedTileIds: [],
    isSaving: false,
    isSelectAll: false,
    isSelecting: false,
    isLocked: true,
    tileEditorOpen: false,
    translatedBoard: null,
    isGettingApiObjects: false,
    copyPublicBoard: false,
    blockedPrivateBoard: false
  };

  async componentDidMount() {
    const {
      match: {
        params: { id }
      }
    } = this.props;

    const {
      board,
      boards,
      communicator,
      changeBoard,
      userData,
      history,
      getApiObjects,
      downloadImages
    } = this.props;

    // Loggedin user?
    if ('name' in userData && 'email' in userData && window.navigator.onLine) {
      //synchronize communicator and boards with API
      this.setState({ isGettingApiObjects: true });
      await getApiObjects();
      this.setState({ isGettingApiObjects: false });
    }

    let boardExists = null;

    if (id && board && id === board.id) {
      //active board = requested board, use that board
      boardExists = boards.find(b => b.id === board.id);
    } else if (id && board && id !== board.id) {
      //active board != requested board, use requested if exist otherwise use active
      boardExists = boards.find(b => b.id === id);
      if (!boardExists) {
        try {
          const remoteBoard = await this.tryRemoteBoard(id);
          if (remoteBoard) {
            boardExists = remoteBoard;
          } else {
            boardExists = boards.find(b => b.id === board.id);
          }
        } catch (err) {
          boardExists = boards.find(b => b.id === board.id);
        }
      }
    } else if (id && !board) {
      //no active board but requested board, use requested
      boardExists = boards.find(b => b.id === id);
      if (!boardExists) {
        try {
          boardExists = await this.tryRemoteBoard(id);
        } catch (err) {
          boardExists = null;
        }
      }
    } else if (!id && !!board) {
      //no requested board, use active board
      boardExists = boards.find(b => b.id === board.id);
    } else {
      //neither requested nor active board, use communicator root board
      boardExists = boards.find(b => b.id === communicator.rootBoard);
    }

    if (!boardExists) {
      // try the root board
      boardExists = boards.find(b => b.id === communicator.rootBoard);
      if (!boardExists) {
        boardExists = boards.find(b => b.id !== '');
      }
    }
    const boardId = boardExists.id;
    changeBoard(boardId);
    const goTo = id ? boardId : `board/${boardId}`;
    history.replace(goTo);

    const translatedBoard = this.translateBoard(boardExists);
    this.setState({ translatedBoard });

    if (isCordova()) downloadImages();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      const {
        navHistory,
        boards,
        changeBoard,
        previousBoard,
        historyRemoveBoard
      } = this.props;

      const boardExists = boards.find(b => b.id === nextProps.match.params.id);
      if (boardExists) {
        // Was a browser back action?
        if (
          navHistory.length >= 2 &&
          nextProps.match.params.id === navHistory[navHistory.length - 2]
        ) {
          changeBoard(nextProps.match.params.id);
          previousBoard();
        }
      } else {
        // Was a browser back action?
        if (
          navHistory.length >= 2 &&
          nextProps.match.params.id === navHistory[navHistory.length - 2]
        ) {
          //board is invalid so we remove from navigation history
          historyRemoveBoard(nextProps.match.params.id);
        }
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

  async tryRemoteBoard(boardId) {
    const { userData } = this.props;
    const remoteBoard = await API.getBoard(boardId);
    //if requested board is from the user just add it
    if (
      'name' in userData &&
      'email' in userData &&
      remoteBoard.email === userData.email &&
      remoteBoard.author === userData.name
    ) {
      return remoteBoard;
    } else {
      //if requested board is public, ask about copy it
      if (remoteBoard.isPublic) {
        this.setState({ copyPublicBoard: remoteBoard });
      } else {
        this.setState({ blockedPrivateBoard: true });
      }
    }
    return null;
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

  handleEditBoardTitle = async name => {
    const { board, userData, updateBoard, updateApiBoard } = this.props;
    const titledBoard = {
      ...board,
      name: name
    };
    updateBoard(titledBoard);

    // Loggedin user?
    if ('name' in userData && 'email' in userData) {
      this.setState({ isSaving: true });
      try {
        await updateApiBoard(titledBoard);
      } catch (err) {
      } finally {
        this.setState({ isSaving: false });
      }
    }
  };

  handleEditClick = () => {
    this.setState({ tileEditorOpen: true });
  };

  handleTileEditorCancel = () => {
    this.setState({ tileEditorOpen: false });
  };

  handleEditTileEditorSubmit = tiles => {
    const { board, editTiles, userData } = this.props;
    editTiles(tiles, board.id);
    // Loggedin user?
    if ('name' in userData && 'email' in userData) {
      this.handleApiUpdates(null, null, tiles);
    }
    this.toggleSelectMode();
  };

  handleAddTileEditorSubmit = tile => {
    const {
      userData,
      createTile,
      board,
      createBoard,
      switchBoard,
      addBoardCommunicator,
      history
    } = this.props;
    const boardData = {
      id: tile.loadBoard,
      name: tile.label,
      nameKey: tile.labelKey,
      hidden: false,
      tiles: [],
      isPublic: false
    };
    if (tile.loadBoard && !tile.linkedBoard) {
      createBoard(boardData);
      addBoardCommunicator(boardData.id);
    }
    if (tile.type !== 'board') {
      createTile(tile, board.id);
    } else {
      switchBoard(boardData.id);
      history.replace(`/board/${boardData.id}`, []);
    }

    // Loggedin user?
    if ('name' in userData && 'email' in userData) {
      this.handleApiUpdates(tile);
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

    const {
      changeBoard,
      changeOutput,
      clickSymbol,
      speak,
      intl,
      boards,
      showNotification
    } = this.props;
    const hasAction = tile.action && tile.action.startsWith('+');

    if (tile.loadBoard) {
      try {
        const boardExists = boards.find(b => b.id === tile.loadBoard);
        if (boardExists) {
          changeBoard(tile.loadBoard);
          this.props.history.push(tile.loadBoard);
        } else {
          const rboardExists = boards.find(b => b.name === tile.label);
          if (rboardExists) {
            changeBoard(rboardExists.id);
            this.props.history.push(rboardExists.id);
          } else {
            showNotification(intl.formatMessage(messages.boardMissed));
          }
        }
      } catch (error) {
        console.log(error.message);
        showNotification(intl.formatMessage(messages.boardMissed));
      }
    } else {
      changeOutput([...this.props.output, tile]);
      clickSymbol(tile.label);
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
    const {
      intl,
      deleteTiles,
      showNotification,
      board,
      userData,
      communicator,
      deleteBoardCommunicator,
      deleteApiBoard
    } = this.props;
    deleteTiles(this.state.selectedTileIds, board.id);
    this.setState({
      selectedTileIds: []
    });
    showNotification(intl.formatMessage(messages.tilesDeleted));

    // Loggedin user?
    if ('name' in userData && 'email' in userData) {
      for (let i = 0; i < this.state.selectedTileIds.length; i++) {
        for (let j = 0; j < board.tiles.length; j++) {
          if (
            board.tiles[j].id === this.state.selectedTileIds[i] &&
            board.tiles[j].hasOwnProperty('loadBoard') &&
            board.tiles[j].loadBoard &&
            board.tiles[j].loadBoard.length > 14
          ) {
            if (board.tiles[j].loadBoard !== communicator.rootBoard) {
              deleteBoardCommunicator(board.tiles[j].loadBoard);
              deleteApiBoard(board.tiles[j].loadBoard);
            } else {
              showNotification(
                intl.formatMessage(messages.rootBoardNotDeleted)
              );
            }
          }
        }
      }
      this.handleApiUpdates(null, this.state.selectedTileIds, null);
    }
    this.toggleSelectMode();
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
  };

  async uploadTileSound(tile) {
    if (tile && tile.sound && tile.sound.startsWith('data')) {
      const { userData } = this.props;
      try {
        var blob = new Blob([this.convertDataURIToBinary(tile.sound)], {
          type: 'audio/ogg; codecs=opus'
        });
        const audioUrl = await API.uploadFile(blob, userData.email + '.ogg');
        tile.sound = audioUrl;
      } catch (err) {
        console.log(err.message);
      }
    }
    return tile;
  }

  convertDataURIToBinary(dataURI) {
    var BASE64_MARKER = ';base64,';
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  handleApiUpdates = async (
    tile = null,
    deletedTilesiIds = null,
    editedTiles = null
  ) => {
    const {
      userData,
      communicator,
      board,
      upsertCommunicator,
      changeCommunicator,
      updateApiObjectsNoChild,
      updateApiObjects,
      replaceBoard,
      updateBoard,
      switchBoard
    } = this.props;

    // Loggedin user?
    if ('name' in userData && 'email' in userData) {
      this.setState({
        isSaving: true
      });

      if (tile && tile.sound && tile.sound.startsWith('data')) {
        tile = await this.uploadTileSound(tile);
      }
      if (editedTiles) {
        let _editedTiles = [];
        for (let _tile of editedTiles) {
          _editedTiles.push(await this.uploadTileSound(_tile));
        }
        editedTiles = _editedTiles;
      }

      var createCommunicator = false;
      var createParentBoard = false;
      var createChildBoard = false;
      var childBoardData = null;

      let uTiles = [];
      if (deletedTilesiIds) {
        uTiles = board.tiles.filter(
          cTile => !deletedTilesiIds.includes(cTile.id)
        );
      }
      if (editedTiles) {
        uTiles = board.tiles.map(
          cTile => editedTiles.find(s => s.id === cTile.id) || cTile
        );
      }
      if (tile && tile.type !== 'board') {
        uTiles = [...board.tiles, tile];
      }
      if (tile && tile.type === 'board') {
        uTiles = [...board.tiles];
      }

      const parentBoardData = {
        ...board,
        tiles: uTiles,
        author: userData.name,
        email: userData.email,
        hidden: false
      };
      //check if user has an own communicator
      let communicatorData = { ...communicator };
      if (communicator.email !== userData.email) {
        //need to create a new communicator
        communicatorData = {
          ...communicator,
          author: userData.name,
          email: userData.email,
          id: shortid.generate()
        };
        upsertCommunicator(communicatorData);
        changeCommunicator(communicatorData.id);
        createCommunicator = true;
      }
      //check for a new  own board
      if (tile && tile.loadBoard && !tile.linkedBoard) {
        const boardData = {
          id: tile.loadBoard,
          name: tile.label,
          nameKey: tile.labelKey,
          hidden: false,
          tiles: [],
          isPublic: false,
          author: userData.name,
          email: userData.email,
          locale: userData.locale,
          caption: tile.image
        };
        childBoardData = { ...boardData };
        createChildBoard = true;
        updateBoard(childBoardData);
      }
      //check if we have to create a copy of the parent
      if (parentBoardData.id.length < 14) {
        createParentBoard = true;
      } else {
        //update the parent
        updateBoard(parentBoardData);
      }
      //api updates
      if (tile && tile.type === 'board') {
        //child becomes parent
        updateApiObjectsNoChild(childBoardData, createCommunicator, true)
          .then(parentBoardId => {
            switchBoard(parentBoardId);
            this.props.history.replace(`/board/${parentBoardId}`, []);
            this.setState({ isSaving: false });
          })
          .catch(e => {
            this.setState({ isSaving: false });
          });
      } else {
        if (!createChildBoard) {
          updateApiObjectsNoChild(
            parentBoardData,
            createCommunicator,
            createParentBoard
          )
            .then(parentBoardId => {
              if (createParentBoard) {
                replaceBoard(
                  { ...parentBoardData },
                  { ...parentBoardData, id: parentBoardId }
                );
              }
              this.props.history.replace(`/board/${parentBoardId}`);
              this.setState({ isSaving: false });
            })
            .catch(e => {
              this.setState({ isSaving: false });
            });
        } else {
          updateApiObjects(
            childBoardData,
            parentBoardData,
            createCommunicator,
            createParentBoard
          )
            .then(parentBoardId => {
              if (createParentBoard) {
                replaceBoard(
                  { ...parentBoardData },
                  { ...parentBoardData, id: parentBoardId }
                );
              }
              this.props.history.replace(`/board/${parentBoardId}`);
              this.setState({ isSaving: false });
            })
            .catch(e => {
              this.setState({ isSaving: false });
            });
        }
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

  handleCopyRemoteBoard = async () => {
    const { intl, showNotification } = this.props;
    await this.createBoarsRecursively(this.state.copyPublicBoard);
    showNotification(intl.formatMessage(messages.boardCopiedSuccessfully));
  };

  async createBoarsRecursively(board) {
    const {
      createBoard,
      addBoardCommunicator,
      switchBoard,
      history,
      userData,
      updateApiObjectsNoChild,
      communicator,
      boards,
      updateBoard
    } = this.props;

    let newBoard = {
      ...board,
      isPublic: false,
      id: shortid.generate(),
      hidden: false,
      author: '',
      email: ''
    };
    if ('name' in userData && 'email' in userData) {
      newBoard = {
        ...newBoard,
        author: userData.name,
        email: userData.email
      };
    }
    createBoard(newBoard);
    //look for reference to the original board id
    boards.forEach(b => {
      b.tiles.forEach((tile, index) => {
        if (tile.loadBoard && tile.loadBoard === board.id) {
          b.tiles.splice(index, 1, {
            ...tile,
            loadBoard: newBoard.id
          });
          updateBoard(b);
        }
      });
    });
    if (this.state.copyPublicBoard) {
      addBoardCommunicator(newBoard.id);
      switchBoard(newBoard.id);
      history.replace(`/board/${newBoard.id}`, []);
      const translatedBoard = this.translateBoard(newBoard);
      this.setState({
        translatedBoard
      });
    }
    // Loggedin user?
    if ('name' in userData && 'email' in userData) {
      this.setState({
        isSaving: true
      });
      let createCommunicator = false;
      if (communicator.email !== userData.email) {
        //need to create a new communicator
        const communicatorData = {
          ...communicator,
          author: userData.name,
          email: userData.email,
          id: shortid.generate()
        };
        upsertCommunicator(communicatorData);
        changeCommunicator(communicatorData.id);
        createCommunicator = true;
      }
      try {
        const apiBoardId = await updateApiObjectsNoChild(
          newBoard,
          createCommunicator,
          true
        );
        if (this.state.copyPublicBoard) {
          switchBoard(apiBoardId);
          history.replace(`/board/${apiBoardId}`, []);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        this.setState({
          isSaving: false,
          copyPublicBoard: false,
          blockedPrivateBoard: false
        });
      }
      //return condition
      if (!board || board.tiles.length < 1) {
        return;
      } else {
        board.tiles.forEach(async tile => {
          if (tile.loadBoard) {
            const nextBoard = await API.getBoard(tile.loadBoard);
            this.createBoarsRecursively(nextBoard);
          }
        });
      }
    }
  }

  handleCloseDialog = () => {
    this.setState({
      copyPublicBoard: false,
      blockedPrivateBoard: false
    });
  };

  onRequestRootBoard() {
    const count = this.props.navHistory.length - 1;
    for (let i = 0; i < count; i++) {
      this.onRequestPreviousBoard();
    }
  }

  publishBoard = async () => {
    const { board, userData, replaceBoard } = this.props;
    const boardData = {
      ...this.props.board,
      isPublic: !this.props.board.isPublic
    };
    replaceBoard(board, boardData);

    // Loggedin user?
    if ('name' in userData && 'email' in userData) {
      try {
        const boardResponse = await API.updateBoard(boardData);
        replaceBoard(boardData, boardResponse);
      } catch (err) {}
    }
  };

  render() {
    const { navHistory, board, focusTile } = this.props;

    if (!this.state.translatedBoard) {
      return (
        <div className="Board__loading">
          <CircularProgress size={60} thickness={5} color="inherit" />
        </div>
      );
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
          intl={this.props.intl}
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
        <Dialog
          open={!!this.state.copyPublicBoard}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleCloseDialog}
          aria-labelledby="dialog-copy-title"
          aria-describedby="dialog-copy-desc"
        >
          <DialogTitle id="dialog-copy-board-title">
            {this.props.intl.formatMessage(messages.copyPublicBoardTitle)}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="dialog-copy-board-desc">
              {this.props.intl.formatMessage(messages.copyPublicBoardDesc)}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="primary">
              {this.props.intl.formatMessage(messages.boardCopyCancel)}
            </Button>
            <Button onClick={this.handleCopyRemoteBoard} color="primary">
              {this.props.intl.formatMessage(messages.boardCopyAccept)}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.blockedPrivateBoard}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleCloseDialog}
          aria-labelledby="dialog-blocked-title"
          aria-describedby="dialog-blocked-desc"
        >
          <DialogTitle id="dialog-blocked-board-title">
            {this.props.intl.formatMessage(messages.blockedPrivateBoardTitle)}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="dialog-blocked-board-desc">
              {this.props.intl.formatMessage(messages.blockedPrivateBoardDesc)}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="primary">
              {this.props.intl.formatMessage(messages.boardCopyAccept)}
            </Button>
          </DialogActions>
        </Dialog>

        <TileEditor
          editingTiles={editingTiles}
          open={this.state.tileEditorOpen}
          onClose={this.handleTileEditorCancel}
          onEditSubmit={this.handleEditTileEditorSubmit}
          onAddSubmit={this.handleAddTileEditorSubmit}
          boards={this.props.boards}
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
  historyRemoveBoard,
  createBoard,
  updateBoard,
  switchBoard,
  createTile,
  deleteTiles,
  editTiles,
  focusTile,
  clickSymbol,
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
  deleteApiBoard,
  downloadImages,
  updateApiBoard
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(BoardContainer));
