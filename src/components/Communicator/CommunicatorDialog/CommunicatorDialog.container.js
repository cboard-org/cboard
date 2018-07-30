import React from 'react';
import { connect } from 'react-redux';
import CommunicatorDialog from './CommunicatorDialog.component';
import { TAB_INDEXES } from './CommunicatorDialog.constants';
import { injectIntl } from 'react-intl';
import API from '../../../api';

const BOARDS_PAGE_LIMIT = 10;
const INITIAL_STATE = {
  publicBoards: {
    page: 0,
    total: 0,
    search: '',
    data: []
  },
  myBoards: {
    page: 0,
    total: 0,
    search: '',
    data: []
  }
};

const findLocalBoards = (boards, intl, value = '') => {
  return boards.filter(board => {
    const title = intl.formatMessage({
      id: board.nameKey || board.name || board.id
    });

    let returnValue = title.toLowerCase().indexOf(value.toLowerCase()) >= 0;
    returnValue =
      returnValue ||
      (board.author &&
        board.author.toLowerCase().indexOf(value.toLowerCase()) >= 0);

    return returnValue;
  });
};

const STATE_TAB_MAP = {
  [TAB_INDEXES.COMMUNICATOR_BOARDS]: 'communicatorBoards',
  [TAB_INDEXES.ALL_BOARDS]: 'publicBoards',
  [TAB_INDEXES.MY_BOARDS]: 'myBoards'
};

class CommunicatorDialogContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      boards: props.communicatorBoards, // First time => Communicator Boards Tab
      selectedTab: TAB_INDEXES.COMMUNICATOR_BOARDS,
      communicatorBoards: props.communicatorBoards,
      cboardBoards: props.cboardBoards,
      publicBoards: INITIAL_STATE.publicBoards,
      myBoards: INITIAL_STATE.myBoards,
      totalPages: Math.ceil(
        props.communicatorBoards.length / BOARDS_PAGE_LIMIT
      ),
      page: 1,
      search: ''
    };
  }

  async onTabChange(event, selectedTab = TAB_INDEXES.COMMUNICATOR_BOARDS) {
    const tabData = await this.doSearch(this.state.search, 1, 0, selectedTab);
    this.setState({
      ...tabData,
      selectedTab,
      page: 1
    });
  }

  async loadNextPage() {
    const page = this.state.page + 1;
    const selectedTabData = this.state[STATE_TAB_MAP[this.state.selectedTab]];
    const nextApiPage = selectedTabData.page + 1;
    const apiPages = Math.ceil(selectedTabData.total / BOARDS_PAGE_LIMIT);

    let newState = { page };
    let localPages = 0;
    if (this.state.selectedTab === TAB_INDEXES.ALL_BOARDS) {
      const localBoards = findLocalBoards(
        this.state.cboardBoards,
        this.props.intl,
        this.state.search
      );
      localPages = Math.ceil(localBoards.length / BOARDS_PAGE_LIMIT);
    }

    if (page > localPages && nextApiPage <= apiPages) {
      const {
        boards,
        totalPages,
        publicBoards,
        myBoards
      } = await this.doSearch(selectedTabData.search, nextApiPage);

      newState = {
        ...newState,
        boards,
        totalPages,
        publicBoards,
        myBoards
      };
    }

    this.setState(newState);
  }

  async doSearch(
    search,
    page = 1,
    offset = 0,
    selectedTab = this.state.selectedTab
  ) {
    let boards = [];
    let totalPages = 1;
    const selectedProperty = STATE_TAB_MAP[selectedTab];
    let dataForProperty =
      page > 1 ? this.state[selectedProperty] : INITIAL_STATE[selectedProperty];

    switch (selectedTab) {
      case TAB_INDEXES.COMMUNICATOR_BOARDS:
        dataForProperty = this.state.communicatorBoards;
        boards = findLocalBoards(dataForProperty, this.props.intl, search);
        totalPages = Math.ceil(boards.length / BOARDS_PAGE_LIMIT);
        break;

      case TAB_INDEXES.ALL_BOARDS:
        const localBoards = findLocalBoards(
          this.state.cboardBoards,
          this.props.intl,
          search
        );
        const publicBoardsResponse = await API.getBoards({
          limit: BOARDS_PAGE_LIMIT,
          page,
          search,
          offset
        });
        const totalAllBoards = localBoards.length + publicBoardsResponse.total;
        totalPages = Math.ceil(totalAllBoards / BOARDS_PAGE_LIMIT);
        dataForProperty = {
          ...publicBoardsResponse,
          data: dataForProperty.data.concat(publicBoardsResponse.data)
        };
        boards = localBoards.concat(dataForProperty.data);
        break;

      case TAB_INDEXES.MY_BOARDS:
        const myBoardsResponse = await API.getMyBoards({
          limit: BOARDS_PAGE_LIMIT,
          page,
          search,
          offset
        });
        totalPages = Math.ceil(myBoardsResponse.total / BOARDS_PAGE_LIMIT);
        dataForProperty = {
          ...myBoardsResponse,
          data: dataForProperty.data.concat(myBoardsResponse.data)
        };
        boards = dataForProperty.data;
        break;

      default:
        break;
    }

    const myBoards = this.state.myBoards;
    const publicBoards = this.state.publicBoards;
    return {
      boards,
      totalPages,
      publicBoards,
      myBoards,
      [selectedProperty]: dataForProperty
    };
  }

  async onSearch(search = this.state.search) {
    this.setState({
      boards: [],
      loading: true,
      page: 1,
      totalPages: 1,
      search
    });
    const { boards, totalPages, publicBoards, myBoards } = await this.doSearch(
      search
    );
    this.setState({
      boards,
      page: 1,
      totalPages,
      publicBoards,
      myBoards,
      loading: false
    });
  }

  render() {
    const limit = this.state.page * BOARDS_PAGE_LIMIT;
    const dialogProps = {
      ...this.props,
      ...this.state,
      limit,
      loadNextPage: this.loadNextPage.bind(this),
      onTabChange: this.onTabChange.bind(this),
      onSearch: this.onSearch.bind(this)
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
  const cboardBoards = board.boards;

  return {
    ...ownProps,
    communicatorBoards,
    cboardBoards,
    userData
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(CommunicatorDialogContainer));
