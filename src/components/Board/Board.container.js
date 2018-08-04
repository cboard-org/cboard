import React, { PureComponent } from 'react';
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
  changeOutput
} from './Board.actions';
import messages from './Board.messages';
import Board from './Board.component';
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

  state = {
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

    if (this.props.board && this.props.board.id !== nextProps.board.id) {
      const translatedBoard = this.translateBoard(nextProps.board);
      this.setState({ translatedBoard });
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

  handleTileClick = tile => {
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

  handleDeleteTiles = (tiles, boardId) => {
    const { intl, deleteTiles, showNotification } = this.props;
    deleteTiles(tiles, boardId);
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

  render() {
    const {
      navHistory,
      board,
      createBoard,
      editTiles,
      focusTile,
      match: {
        params: { id }
      }
    } = this.props;

    if (!this.state.translatedBoard || board.id !== id) {
      return null;
    }

    const disableBackButton = navHistory.length === 1;

    return (
      <Board
        disableBackButton={disableBackButton}
        board={this.state.translatedBoard}
        onLockNotify={this.handleLockNotify}
        onTileClick={this.handleTileClick}
        onRequestPreviousBoard={this.onRequestPreviousBoard.bind(this)}
        onAddBoard={createBoard}
        onAddTile={this.handleAddTile}
        onEditTiles={editTiles}
        onDeleteTiles={this.handleDeleteTiles}
        onFocusTile={focusTile}
      />
    );
  }
}

const mapStateToProps = ({ board, communicator, language }) => {
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
    navHistory: board.navHistory
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
  hideNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(BoardContainer));
