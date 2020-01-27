import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import CommunicatorToolbar from './CommunicatorToolbar.component';

jest.mock('./CommunicatorToolbar.messages', () => {
  return {
    communicators: {
      id: 'cboard.components.CommunicatorToolbar.communicators',
      defaultMessage: 'Communicators'
    },
    editTitle: {
      id: 'cboard.components.CommunicatorToolbar.editTitle',
      defaultMessage: 'Edit Communicator Title'
    },
    communicatorTitle: {
      id: 'cboard.components.CommunicatorToolbar.communicatorTitle',
      defaultMessage: 'Communicator Title'
    },
    boards: {
      id: 'cboard.components.CommunicatorToolbar.boards',
      defaultMessage: 'Boards'
    },
    copyMessage: {
      id: 'cboard.components.CommunicatorToolbar.copyMessage',
      defaultMessage: 'Copied to clipboard!'
    },
    share: {
      id: 'cboard.components.CommunicatorToolbar.share',
      defaultMessage: 'Share'
    },
    tiles: {
      id: 'cboard.components.CommunicatorToolbar.tiles',
      defaultMessage: 'Tiles'
    },
    editCommunicator: {
      id: 'cboard.components.CommunicatorToolbar.editCommunicator',
      defaultMessage: 'Build'
    },
    addBoardButton: {
      id: 'cboard.components.CommunicatorToolbar.addBoardButton',
      defaultMessage: 'Add Board'
    }
  };
});

let switchBoardsCount = 0;
const intlMock = {
  formatMessage: ({ id }) => id
};

const COMPONENT_PROPS = {
  intl: intlMock,
  isSelecting: false,
  boards: [
    {
      id: 'board-1',
      nameKey: 'board-1-name-key',
      tiles: []
    },
    {
      id: 'board-2',
      name: 'board-2-name',
      tiles: []
    }
  ],
  switchBoard: () => {
    switchBoardsCount++;
  },
  currentCommunicator: {
    name: 'some-communicator-title'
  },
  history: {
    replace: () => {}
  },
  openCommunicatorDialog: () => {},
  editCommunicatorTitle: () => {}
};

describe('Communicator tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<CommunicatorToolbar {...COMPONENT_PROPS} />);
  });

  test('menu behavior', () => {
    const wrapper = shallow(<CommunicatorToolbar {...COMPONENT_PROPS} />);
    let tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

    let boardsMenu = wrapper.find('#boards-menu').get(0);
    expect(boardsMenu.props.open).toBe(false);

    const boardsButton = wrapper.find('#boards-button');
    boardsButton.simulate('click', { currentTarget: 'someElement' });

    boardsMenu = wrapper.find('#boards-menu').get(0);
    expect(boardsMenu.props.open).toBe(true);

    tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
  });

  test('switching boards behavior', () => {
    const wrapper = shallow(<CommunicatorToolbar {...COMPONENT_PROPS} />);
    let tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

    let boardsMenu = wrapper.find('#boards-menu').get(0);
    expect(boardsMenu.props.open).toBe(false);

    const boardsButton = wrapper.find('#boards-button');
    boardsButton.simulate('click', { currentTarget: 'someElement' });

    boardsMenu = wrapper.find('#boards-menu').get(0);
    expect(boardsMenu.props.open).toBe(true);

    tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

    expect(switchBoardsCount).toBe(0);

    const firstBoardOption = wrapper
      .find('WithStyles(ForwardRef(ListItem))')
      .get(0);
    firstBoardOption.props.onClick();
    expect(switchBoardsCount).toBe(1);

    const secondBoardOption = wrapper
      .find('WithStyles(ForwardRef(ListItem))')
      .get(1);
    secondBoardOption.props.onClick();
    expect(switchBoardsCount).toBe(2);
  });
});
