import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import CommunicatorDialog from './CommunicatorDialog.component';
import { TAB_INDEXES } from './CommunicatorDialog.constants';

jest.mock('./CommunicatorDialog.messages', () => {
  return {
    title: {
      id: 'cboard.components.CommunicatorDialog.title',
      defaultMessage: 'My Communicator'
    },
    menu: {
      id: 'cboard.components.CommunicatorDialog.menu',
      defaultMessage: 'Menu'
    },
    search: {
      id: 'cboard.components.CommunicatorDialog.search',
      defaultMessage: 'Search'
    },
    author: {
      id: 'cboard.components.CommunicatorDialog.author',
      defaultMessage: 'By {author}'
    },
    addBoard: {
      id: 'cboard.components.CommunicatorDialog.addBoard',
      defaultMessage: 'Add Board'
    },
    removeBoard: {
      id: 'cboard.components.CommunicatorDialog.removeBoard',
      defaultMessage: 'Remove Board'
    },
    communicatorBoards: {
      id: 'cboard.components.CommunicatorDialog.communicatorBoards',
      defaultMessage: 'Included Boards'
    },
    allBoards: {
      id: 'cboard.components.CommunicatorDialog.allBoards',
      defaultMessage: 'All Boards'
    },
    myBoards: {
      id: 'cboard.components.CommunicatorDialog.myBoards',
      defaultMessage: 'My Boards'
    },
    boardsQty: {
      id: 'cboard.components.CommunicatorDialog.boardsQty',
      defaultMessage: '{qty} boards'
    }
  };
});

let selectedTab = TAB_INDEXES.COMMUNICATOR_BOARDS;
let loading = false;

const mockBoard = {
  name: 'tewt',
  id: '12345678901234567',
  tiles: [{ id: '1234567890123456', loadBoard: '456456456456456456456' }],
  isPublic: true,
  caption: 'test',
  email: 'asd@qwe.com',
  markToUpdate: true
};
const mockComm = {
  id: 'cboard_default',
  name: "Cboard's Communicator",
  description: "Cboard's default communicator",
  author: 'Cboard Team',
  email: 'support@cboard.io',
  rootBoard: '12345678901234567',
  boards: ['root', '12345678901234567']
};

const intlMock = {
  formatMessage: ({ id }) => id
};

const COMPONENT_PROPS = {
  intl: intlMock,
  selectedTab,
  loading,
  userData: {
    authToken: 'something'
  },
  communicator: mockComm,
  board: mockBoard,
  onTabChange: (event, value = TAB_INDEXES.COMMUNICATOR_BOARDS) => {
    loading = true;
    selectedTab = value;
  },
  deleteMyBoard: jest.fn(),
  showNotification: jest.fn(),
  copyBoard: jest.fn(),
  publishBoard: jest.fn(),
  addOrRemoveBoard: jest.fn(),
  setRootBoard: jest.fn(),
  publishBoardAction: jest.fn(),
  updateMyBoard: jest.fn()
};

describe('CommunicatorDialog tests', () => {
  beforeEach(() => {
    selectedTab = TAB_INDEXES.COMMUNICATOR_BOARDS;
    loading = false;
  });

  test('default renderer', () => {
    shallowMatchSnapshot(<CommunicatorDialog {...COMPONENT_PROPS} />);
  });

  test('tabs behavior', () => {
    let wrapper = shallow(
      <CommunicatorDialog {...COMPONENT_PROPS} selectedTab={selectedTab} />
    );
    let tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
    let tabsBar = wrapper.find('.CommunicatorDialog__tabs');

    // First tab is active (tabs value = 0)
    expect(selectedTab).toBe(0);
    expect(tabsBar.children().get(selectedTab).props.className).toBe('active');

    tabsBar.simulate('change', {}, TAB_INDEXES.PUBLIC_BOARDS);
    expect(selectedTab).toBe(TAB_INDEXES.PUBLIC_BOARDS);
    // Mount with new tab selected
    wrapper = shallow(
      <CommunicatorDialog {...COMPONENT_PROPS} selectedTab={selectedTab} />
    );
    tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
    tabsBar = wrapper.find('.CommunicatorDialog__tabs');
    expect(tabsBar.children().get(selectedTab).props.className).toBe('active');
  });

  test('loading behavior', () => {
    let wrapper = shallow(
      <CommunicatorDialog
        {...COMPONENT_PROPS}
        selectedTab={selectedTab}
        loading={loading}
      />
    );
    let tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
    let tabsBar = wrapper.find('.CommunicatorDialog__tabs');

    tabsBar.simulate('change', {}, TAB_INDEXES.PUBLIC_BOARDS);
    expect(selectedTab).toBe(TAB_INDEXES.PUBLIC_BOARDS);

    expect(wrapper.find('.CommunicatorDialog__spinner').length).toBe(0);

    // Mount with new tab selected
    wrapper = shallow(
      <CommunicatorDialog
        {...COMPONENT_PROPS}
        selectedTab={selectedTab}
        loading={loading}
      />
    );
    tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
    expect(wrapper.find('.CommunicatorDialog__spinner').length).toBe(1);
  });
});
