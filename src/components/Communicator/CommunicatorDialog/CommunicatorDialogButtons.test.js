import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import CommunicatorDialogButtons from './CommunicatorDialogButtons.component';
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

let searchValue = '';
const COMPONENT_PROPS = {
  intl: intlMock,
  onSearch: value => {
    searchValue = value;
  }
};

describe('CommunicatorDialogButtons tests', () => {
  beforeEach(() => {
    searchValue = '';
  });

  test('default renderer', () => {
    shallowMatchSnapshot(<CommunicatorDialogButtons {...COMPONENT_PROPS} />);
  });

  test('search behavior', () => {
    let wrapper = shallow(<CommunicatorDialogButtons {...COMPONENT_PROPS} />);
    let tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

    let currentState = wrapper.state();
    expect(currentState.showSearchBar).toBe(false);
    expect(currentState.searchValue).toBe('');

    const searchButton = wrapper.find(
      '#communicator-dialog-buttons-search-button'
    );
    searchButton.simulate('click');

    currentState = wrapper.state();
    expect(currentState.showSearchBar).toBe(true);
    expect(searchValue).toBe('');

    const searchInput = wrapper.find('#communicator-dialog-buttons-search');
    searchInput.simulate('change', { target: { value: 'something' } });

    currentState = wrapper.state();
    expect(currentState.showSearchBar).toBe(true);
    expect(searchValue).toBe('something');
  });

  test('menu behavior', () => {
    const wrapper = shallow(<CommunicatorDialogButtons {...COMPONENT_PROPS} />);
    let tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

    let menu = wrapper.find('#communicator-dialog-buttons-menu').get(0);
    expect(menu.props.open).toBe(false);

    const menuButton = wrapper.find('#communicator-dialog-buttons-menu-button');
    menuButton.simulate('click', { currentTarget: 'someElement' });

    menu = wrapper.find('#communicator-dialog-buttons-menu').get(0);
    expect(menu.props.open).toBe(true);

    tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
  });
});
