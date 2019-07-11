import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import CommunicatorBoardItem from './CommunicatorBoardItem.component';

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
    menuRootBoardOption: {
      id: 'cboard.components.CommunicatorDialog.menuRootBoardOption',
      defaultMessage: 'Set as Root Board'
    },
    menuPublishOption: {
      id: 'cboard.components.CommunicatorDialog.menuPublishOption',
      defaultMessage: 'Publish Board'
    },
    menuUnpublishOption: {
      id: 'cboard.components.CommunicatorDialog.menuUnpublishOption',
      defaultMessage: 'Unpublish Board'
    },
    emptyBoardsList: {
      id: 'cboard.components.CommunicatorDialog.emptyBoardsList',
      defaultMessage: 'No boards :('
    },
    loadNextPage: {
      id: 'cboard.components.CommunicatorDialog.loadNextPage',
      defaultMessage: 'Load More'
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
      defaultMessage: 'Boards'
    },
    allBoards: {
      id: 'cboard.components.CommunicatorDialog.allBoards',
      defaultMessage: 'Public Boards'
    },
    myBoards: {
      id: 'cboard.components.CommunicatorDialog.myBoards',
      defaultMessage: 'All My Boards'
    },
    boardsQty: {
      id: 'cboard.components.CommunicatorDialog.boardsQty',
      defaultMessage: '{qty} boards'
    },
    helpAndSupport: {
      id: 'cboard.components.CommunicatorDialog.helpAndSupport',
      defaultMessage: 'Help And Support'
    },
    termsOfService: {
      id: 'cboard.components.CommunicatorDialog.termsOfService',
      defaultMessage: 'Terms Of Service'
    },
    tilesQty: {
      id: 'cboard.components.CommunicatorDialog.tilesQty',
      defaultMessage: '{qty} Tiles'
    },
    boardInfo: {
      id: 'cboard.components.CommunicatorDialog.boardInfo',
      defaultMessage: 'Board Information'
    },
    boardAddedToCommunicator: {
      id: 'cboard.components.CommunicatorDialog.boardAddedToCommunicator',
      defaultMessage: 'Board successfully added to your Communicator'
    },
    boardRemovedFromCommunicator: {
      id: 'cboard.components.CommunicatorDialog.boardRemovedFromCommunicator',
      defaultMessage: 'Board successfully removed from your Communicator'
    },
    close: {
      id: 'cboard.components.CommunicatorDialog.close',
      defaultMessage: 'Close'
    },
    boardInfoName: {
      id: 'cboard.components.CommunicatorDialog.boardInfoName',
      defaultMessage: 'Board name'
    },
    boardInfoAuthor: {
      id: 'cboard.components.CommunicatorDialog.boardInfoAuthor',
      defaultMessage: 'Board Author'
    },
    boardInfoTiles: {
      id: 'cboard.components.CommunicatorDialog.boardInfoTiles',
      defaultMessage: 'Number of tiles'
    },
    boardInfoId: {
      id: 'cboard.components.CommunicatorDialog.boardInfoId',
      defaultMessage: 'Board ID'
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
  },
  addOrRemoveBoard: () => {},
  deleteBoard: () => {},
  publishBoardAction: () => {},
  setRootBoard: () => {}
};

describe('CommunicatorBoardItem tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<CommunicatorBoardItem {...COMPONENT_PROPS} />);
  });
});
