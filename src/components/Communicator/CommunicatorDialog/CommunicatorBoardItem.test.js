import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import CommunicatorBoardItem from './CommunicatorBoardItem.component';
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

const intlMock = {
  formatMessage: ({ id }) => id
};

const COMPONENT_PROPS = {
  intl: intlMock,
  board: {
    id: 'someid',
    author: 'test author',
    nameKey: 'some.namekey.for.board',
    isPublic: false,
    tiles: []
  }
};

describe('CommunicatorBoardItem tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<CommunicatorBoardItem {...COMPONENT_PROPS} />);
  });

  test('menu behavior', () => {
    const wrapper = shallow(<CommunicatorBoardItem {...COMPONENT_PROPS} />);
    let tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

    let menu = wrapper.find('.board-item-menu').get(0);
    expect(menu.props.open).toBe(false);

    const menuButton = wrapper.find('.board-item-menu-button').at(0);
    menuButton.simulate('click', { currentTarget: 'someElement' });

    menu = wrapper.find('.board-item-menu').get(0);
    expect(menu.props.open).toBe(true);

    tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
  });
});
