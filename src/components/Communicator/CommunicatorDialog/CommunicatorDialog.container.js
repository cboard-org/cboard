import React from 'react';
import { connect } from 'react-redux';
import CommunicatorDialog from './CommunicatorDialog.component';
import { TAB_INDEXES } from './CommunicatorDialog.constants';
import { injectIntl } from 'react-intl';
import shortid from 'shortid';
import API from '../../../api';
import {
  createCommunicator,
  editCommunicator,
  changeCommunicator,
  deleteBoardCommunicator,
  addBoardCommunicator,
  upsertCommunicator
} from '../Communicator.actions';
import { deleteBoard, deleteApiBoard } from '../../Board/Board.actions';
import { showNotification } from '../../Notifications/Notifications.actions';
import {
  addBoards,
  replaceBoard,
  createBoard,
  updateBoard,
  updateApiObjectsNoChild,
  updateApiBoard
} from '../../Board/Board.actions';
import messages from './CommunicatorDialog.messages';

const BOARDS_PAGE_LIMIT = 10;
const INITIAL_STATE = {
  page: 0,
  total: 0,
  search: '',
  data: []
};

const findBoards = (boards, criteria, page, search = '') => {
  let result = boards;
  for (let [key, value] of Object.entries(criteria)) {
    result = result.filter(
      board =>
        (board.hasOwnProperty(key) && board[key] === value) ||
        !board.hasOwnProperty(key)
    );
  }
  if (search) {
    let re = new RegExp(search);
    result = result.filter(
      board => re.test(board.name) || re.test(board.author)
    );
  }
  return {
    limit: BOARDS_PAGE_LIMIT,
    offset: 0,
    search: search,
    page: page,
    total: result.length,
    data: result.slice((page - 1) * BOARDS_PAGE_LIMIT, page * BOARDS_PAGE_LIMIT)
  };
};

const STATE_TAB_MAP = {
  [TAB_INDEXES.COMMUNICATOR_BOARDS]: 'communicatorBoards',
  [TAB_INDEXES.PUBLIC_BOARDS]: 'publicBoards',
  [TAB_INDEXES.MY_BOARDS]: 'myBoards'
};

class CommunicatorDialogContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      boards: props.communicatorBoards, // First time => Communicator Boards Tab
      total: props.communicatorBoards.length,
      selectedTab: TAB_INDEXES.COMMUNICATOR_BOARDS,
      totalPages: Math.ceil(
        props.communicatorBoards.length / BOARDS_PAGE_LIMIT
      ),
      page: 1,
      search: '',
      isSearchOpen: false,
      communicatorBoards: findBoards(props.communicatorBoards, {}, 1)
    };
  }

  async onTabChange(event, selectedTab = TAB_INDEXES.COMMUNICATOR_BOARDS) {
    this.setState({ selectedTab, loading: true });
    const tabData = await this.doSearch('', 1, selectedTab);
    this.setState({
      ...tabData,
      selectedTab,
      page: 1,
      search: '',
      isSearchOpen: false,
      loading: false
    });
  }

  async loadNextPage() {
    this.setState({ nextPageLoading: true });
    const page = this.state.page + 1;
    const selectedTab = this.state.selectedTab;
    const tabData = await this.doSearch('', page, selectedTab);
    this.setState({
      ...tabData,
      selectedTab,
      page: page,
      search: '',
      isSearchOpen: false,
      loading: false,
      nextPageLoading: false
    });
  }

  async doSearch(
    search = this.state.search,
    page = this.state.page,
    selectedTab = this.state.selectedTab
  ) {
    let boards = [];
    let totalPages = 1;
    let total = 0;
    const selectedProperty = STATE_TAB_MAP[selectedTab];
    let dataForProperty =
      page > 1 ? this.state[selectedProperty] : INITIAL_STATE;

    switch (selectedTab) {
      case TAB_INDEXES.COMMUNICATOR_BOARDS:
        const commState = findBoards(
          this.props.communicatorBoards,
          {},
          page,
          search
        );
        boards = dataForProperty.data.concat(commState.data);
        total = commState.total;
        totalPages = Math.ceil(commState.total / BOARDS_PAGE_LIMIT);
        dataForProperty = {
          ...commState,
          data: boards
        };
        break;
      case TAB_INDEXES.PUBLIC_BOARDS:
        let externalState = INITIAL_STATE;
        try {
          externalState = await API.getPublicBoards({
            limit: BOARDS_PAGE_LIMIT,
            page,
            search
          });
        } catch (err) {
          externalState = findBoards(
            this.props.availableBoards,
            {
              isPublic: true,
              hidden: false
            },
            page,
            search
          );
        }
        boards = dataForProperty.data.concat(externalState.data);
        total = externalState.total;
        totalPages = Math.ceil(externalState.total / BOARDS_PAGE_LIMIT);
        dataForProperty = {
          ...externalState,
          data: boards
        };
        break;
      case TAB_INDEXES.MY_BOARDS:
        let myBoardsResponse = INITIAL_STATE;
        try {
          myBoardsResponse = await API.getMyBoards({
            limit: BOARDS_PAGE_LIMIT,
            page,
            search
          });
        } catch (err) {
          myBoardsResponse = findBoards(
            this.props.availableBoards,
            {
              email: this.props.userData.email,
              hidden: false
            },
            page,
            search
          );
        }
        boards = dataForProperty.data.concat(myBoardsResponse.data);
        total = myBoardsResponse.total;
        totalPages = Math.ceil(myBoardsResponse.total / BOARDS_PAGE_LIMIT);
        dataForProperty = {
          ...myBoardsResponse,
          data: boards
        };
        break;
      default:
        break;
    }

    return {
      boards,
      totalPages,
      total,
      [selectedProperty]: dataForProperty
    };
  }

  async onSearch(search = this.state.search) {
    this.setState({
      search,
      boards: [],
      loading: true,
      page: 1,
      totalPages: 1
    });
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(async () => {
      const { boards, totalPages } = await this.doSearch(search);
      this.setState({
        boards,
        page: 1,
        totalPages,
        loading: false
      });
    }, 500);
  }

  async addOrRemoveBoard(board) {
    const BOARD_ACTIONS_MAP = {
      [TAB_INDEXES.COMMUNICATOR_BOARDS]: 'communicatorBoardsAction',
      [TAB_INDEXES.PUBLIC_BOARDS]: 'addOrRemoveAction',
      [TAB_INDEXES.MY_BOARDS]: 'addOrRemoveAction'
    };
    const action = BOARD_ACTIONS_MAP[this.state.selectedTab];
    await this[action](board);
  }

  async communicatorBoardsAction(board) {
    // If Communicator Tab is selected, the board should be removed from the Communicator
    const communicatorBoards = this.props.communicatorBoards.filter(
      cb => cb.id !== board.id
    );
    await this.updateCommunicatorBoards(communicatorBoards);
    this.setState({ boards: communicatorBoards });
  }

  async copyBoard(board) {
    const { intl, showNotification } = this.props;
    await this.createBoarsRecursively(board, true);
    showNotification(intl.formatMessage(messages.boardAddedToCommunicator));
  }

  async createBoarsRecursively(board, parentBoard) {
    const {
      createBoard,
      addBoardCommunicator,
      userData,
      updateApiObjectsNoChild
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
    if (parentBoard) {
      addBoardCommunicator(newBoard.id);
    }
    try {
      await this.updateBoardReferences(board, newBoard);
    } catch (err) {
      console.log(err.message);
    }
    // Loggedin user?
    if ('name' in userData && 'email' in userData) {
      let createCommunicator = false;
      try {
        await updateApiObjectsNoChild(newBoard, createCommunicator, true);
      } catch (err) {
        console.log(err.message);
      }
    }

    //return condition
    if (!board || board.tiles.length < 1) {
      return;
    } else {
      board.tiles.forEach(async tile => {
        if (tile.loadBoard) {
          const nextBoard = await API.getBoard(tile.loadBoard);
          this.createBoarsRecursively(nextBoard, false);
        }
      });
    }
  }

  async updateBoardReferences(board, newBoard) {
    return new Promise((resolve, reject) => {
      const { availableBoards, updateBoard } = this.props;
      //look for reference to the original board id
      try {
        availableBoards.forEach(b => {
          b.tiles.forEach((tile, index) => {
            if (tile && tile.loadBoard && tile.loadBoard === board.id) {
              b.tiles.splice(index, 1, {
                ...tile,
                loadBoard: newBoard.id
              });
              updateBoard(b);
            }
          });
        });
      } catch (err) {
        reject(new Error(err));
      }
      resolve();
    });
  }

  async addOrRemoveAction(board) {
    // If All My Boards Tab is selected, the board should be added/removed to/from the Communicator
    let communicatorBoards = [...this.props.communicatorBoards];
    const boardIndex = communicatorBoards.findIndex(b => b.id === board.id);
    if (boardIndex >= 0) {
      communicatorBoards.splice(boardIndex, 1);
      this.props.showNotification(
        this.props.intl.formatMessage(messages.boardRemovedFromCommunicator)
      );
    } else {
      communicatorBoards.push(board);
      this.props.showNotification(
        this.props.intl.formatMessage(messages.boardAddedToCommunicator)
      );
    }

    await this.updateCommunicatorBoards(communicatorBoards);

    // Need to fetch board if its not locally available
    if (
      boardIndex < 0 &&
      this.props.availableBoards.findIndex(b => b.id === board.id) < 0
    ) {
      let boards = [];
      try {
        const boardData = await API.getBoard(board.id);
        boards.push(boardData);
      } catch (e) {}
      this.props.addBoards(boards);
    }
  }

  async updateCommunicatorBoards(boards) {
    const {
      userData,
      communicators,
      currentCommunicator,
      changeCommunicator,
      editCommunicator
    } = this.props;

    const updatedCommunicatorData = {
      ...currentCommunicator,
      boards: boards.map(cb => cb.id)
    };

    if (communicators.findIndex(c => c.id === currentCommunicator.id) >= 0) {
      editCommunicator(updatedCommunicatorData);
      changeCommunicator(updatedCommunicatorData.id);

      // Loggedin user?
      if ('name' in userData && 'email' in userData) {
        try {
          await API.updateCommunicator(updatedCommunicatorData);
        } catch (err) {}
      }
    }
  }

  async publishBoard(board) {
    const { userData, replaceBoard, showNotification, intl } = this.props;
    const boardData = {
      ...board,
      isPublic: !board.isPublic
    };
    const sBoards = this.state.boards;
    const index = sBoards.findIndex(b => board.id === b.id);
    sBoards.splice(index, 1, boardData);
    replaceBoard(board, boardData);
    this.setState({
      boards: sBoards
    });
    boardData.isPublic
      ? showNotification(intl.formatMessage(messages.boardPublished))
      : showNotification(intl.formatMessage(messages.boardUnpublished));

    // Loggedin user?
    if ('name' in userData && 'email' in userData) {
      try {
        const boardResponse = await API.updateBoard(boardData);
        replaceBoard(boardData, boardResponse);
      } catch (err) {}
    }
  }

  async setRootBoard(board) {
    const {
      userData,
      communicators,
      currentCommunicator,
      changeCommunicator,
      editCommunicator
    } = this.props;

    const updatedCommunicatorData = {
      ...currentCommunicator,
      rootBoard: board.id
    };

    if (communicators.findIndex(c => c.id === currentCommunicator.id) >= 0) {
      editCommunicator(updatedCommunicatorData);
      changeCommunicator(updatedCommunicatorData.id);

      // Loggedin user?
      if ('name' in userData && 'email' in userData) {
        try {
          await API.updateCommunicator(updatedCommunicatorData);
        } catch (err) {}
      }
    }
  }

  openSearchBar() {
    this.setState({ isSearchOpen: true });
  }

  async deleteMyBoard(board) {
    const {
      showNotification,
      deleteBoard,
      communicators,
      editCommunicator,
      deleteApiBoard,
      userData,
      intl
    } = this.props;
    deleteBoard(board.id);

    // Loggedin user?
    if ('name' in userData && 'email' in userData) {
      try {
        await deleteApiBoard(board.id);
      } catch (err) {}
    }
    communicators.forEach(async comm => {
      if (comm.boards.includes(board.id)) {
        editCommunicator({
          ...comm,
          boards: comm.boards.filter(b => b !== board.id)
        });

        // Loggedin user?
        if ('name' in userData && 'email' in userData) {
          try {
            await API.updateCommunicator(comm);
          } catch (err) {}
        }
      }
    });
    const sBoards = this.state.boards;
    const index = sBoards.findIndex(b => board.id === b.id);
    sBoards.splice(index, 1);
    this.setState({
      boards: sBoards
    });
    showNotification(intl.formatMessage(messages.boardDeleted));
  }

  async updateMyBoard(board) {
    const { updateBoard, updateApiBoard, userData } = this.props;
    updateBoard(board);
    const sBoards = this.state.boards;
    const index = sBoards.findIndex(b => board.id === b.id);
    sBoards.splice(index, 1, board);
    this.setState({
      boards: sBoards
    });

    // Loggedin user?
    if ('name' in userData && 'email' in userData) {
      try {
        await updateApiBoard(board);
      } catch (err) {}
    }
  }

  render() {
    const limit = this.state.page * BOARDS_PAGE_LIMIT;
    const communicatorBoardsIds = this.props.communicatorBoards.map(b => b.id);
    const dialogProps = {
      ...this.props,
      ...this.state,
      limit,
      communicator: this.props.currentCommunicator,
      communicatorBoardsIds,
      addOrRemoveBoard: this.addOrRemoveBoard.bind(this),
      deleteMyBoard: this.deleteMyBoard.bind(this),
      updateMyBoard: this.updateMyBoard.bind(this),
      publishBoard: this.publishBoard.bind(this),
      setRootBoard: this.setRootBoard.bind(this),
      copyBoard: this.copyBoard.bind(this),
      loadNextPage: this.loadNextPage.bind(this),
      onTabChange: this.onTabChange.bind(this),
      onSearch: this.onSearch.bind(this),
      openSearchBar: this.openSearchBar.bind(this)
    };

    return <CommunicatorDialog {...dialogProps} />;
  }
}

const mapStateToProps = ({ board, communicator, language, app }, ownProps) => {
  const activeCommunicatorId = communicator.activeCommunicatorId;
  const currentCommunicator = communicator.communicators.find(
    communicator => communicator.id === activeCommunicatorId
  );

  const communicatorBoards = board.boards.filter(
    board => currentCommunicator.boards.indexOf(board.id) >= 0
  );

  const { userData } = app;
  const cboardBoards = board.boards.filter(
    board => board.email === 'support@cboard.io'
  );

  return {
    ...ownProps,
    communicators: communicator.communicators,
    currentCommunicator,
    communicatorBoards,
    cboardBoards,
    availableBoards: board.boards,
    userData,
    activeBoardId: board.activeBoardId
  };
};

const mapDispatchToProps = {
  createCommunicator,
  editCommunicator,
  changeCommunicator,
  addBoards,
  replaceBoard,
  showNotification,
  deleteBoard,
  deleteApiBoard,
  deleteBoardCommunicator,
  createBoard,
  updateBoard,
  addBoardCommunicator,
  upsertCommunicator,
  updateApiObjectsNoChild,
  updateApiBoard
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(CommunicatorDialogContainer));
