import React from 'react';
import { shallowMatchSnapshot } from '../../../common/test_utils';
import toJson from 'enzyme-to-json';
import { shallow } from 'enzyme';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import shortid from 'shortid';

import API from '../../../api';
import { ImportContainer } from './Import.container';
import { cboardImportAdapter, obzImportAdapter } from './Import.helpers';
import Import from './Import.component';

jest.mock('./Import.messages', () => {
  return {
    import: {
      id: 'cboard.components.Settings.Import.import',
      defaultMessage: 'Import'
    },
    restore: {
      id: 'cboard.components.Settings.Import.restore',
      defaultMessage: 'Restore'
    },
    exportSecondary: {
      id: 'cboard.components.Settings.Import.importSecondary',
      defaultMessage: 'Backup your boards'
    }
  };
});

const COMPONENT_PROPS = {
  onImportClick: () => {},
  onClose: () => {}
};

describe('Import tests', () => {
  test('default renderer', () => {
    shallowMatchSnapshot(<Import {...COMPONENT_PROPS} />);
  });

  test('loading behavior', () => {
    const wrapper = shallow(<Import {...COMPONENT_PROPS} />);
    let tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();

    wrapper.instance().onImportClick = jest.fn(type => {
      wrapper.setState({ loading: true });
    });

    let spinnerWrapper = wrapper.find('.Import__ButtonContainer--spinner');
    expect(spinnerWrapper.length).toBe(0);

    const importButton = wrapper.find('#import-button input');
    importButton.simulate('change', { currentTarget: 'someElement' });

    spinnerWrapper = wrapper.find('.Import__ButtonContainer--spinner');
    expect(spinnerWrapper.length).toBe(1);

    expect(wrapper.find('#import-button').get(0).props.disabled).toBe(true);

    tree = toJson(wrapper);
    expect(tree).toMatchSnapshot();
  });
  test('check click ', () => {
    const event = {
      persist: jest.fn()
    };
    const wrapper = shallow(<Import {...COMPONENT_PROPS} />);
    const cboard = wrapper.find('#file');
    cboard.prop('onChange')(event);
  });
});

describe('tests for cboardImportAdapter refactor', () => {
  test('Must import a new board correctly', async () => {
    // 1. Mock new board as json
    const newBoard = {
      id: 'new-board',
      name: 'New Board',
      tiles: [
        {
          id: 'tile-1',
          label: 'Test',
          type: 'button'
        }
      ]
    };

    // 2. Create mock of file for FileReader
    // Pass array of boards
    const fileContent = JSON.stringify([newBoard]);
    const mockFile = new File([fileContent], 'import.json', {
      type: 'application/json'
    });

    // 3. Prepare other variables for cboardImportAdapter
    const mockIntl = {};
    const allBoardsEmpty = [];

    // 4. Execute
    const result = await cboardImportAdapter(
      mockFile,
      mockIntl,
      allBoardsEmpty
    );

    // 5. Assert
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(newBoard);
  });

  test('Must ignore hidden boards', async () => {
    // 1. Mock board with ext_cboard_hidden: true
    const hiddenBoard = {
      id: 'hidden-board',
      name: 'Hidden Board',
      ext_cboard_hidden: true,
      tiles: []
    };
    // 2. Create mock file
    const fileContent = JSON.stringify([hiddenBoard]);
    const mockFile = new File([fileContent], 'import.json', {
      type: 'application/json'
    });
    // 3. Execute
    const result = await cboardImportAdapter(mockFile, {}, []);
    // 4. Assert - hidden board must be ignored
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(0);
  });

  test('Must ignore board with id "root"', async () => {
    const rootBoard = {
      id: 'root',
      name: 'Root Board',
      tiles: []
    };
    const fileContent = JSON.stringify([rootBoard]);
    const mockFile = new File([fileContent], 'import.json', {
      type: 'application/json'
    });
    const result = await cboardImportAdapter(mockFile, {}, []);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(0);
  });

  test('Must not discard board if the id already exists', async () => {
    const rootBoard = {
      id: 'boardRoot',
      name: 'Board Root',
      tiles: []
    };
    const fileContent = JSON.stringify([rootBoard]);
    const mockFile = new File([fileContent], 'import.json', {
      type: 'application/json'
    });
    const allBoards = [{ id: 'boardRoot' }];
    const result = await cboardImportAdapter(mockFile, {}, allBoards);
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
  });

  test('Must generate a new ID if there is a collision', async () => {
    const collisionBoard = {
      id: 'board-123',
      name: 'Board with collision ID',
      tiles: []
    };
    const fileContent = JSON.stringify([collisionBoard]);
    const mockFile = new File([fileContent], 'import.json', {
      type: 'application/json'
    });
    const allBoards = [{ id: 'board-123' }];

    const result = await cboardImportAdapter(mockFile, {}, allBoards);

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0].id).not.toBe('board-123');
    expect(result[0].id).toBeDefined();
  });

  test('Must save the old ID in the prevId property in case of collision', async () => {
    const collisionBoard = {
      id: 'board-123',
      name: 'Board with collision ID',
      tiles: []
    };
    const fileContent = JSON.stringify([collisionBoard]);
    const mockFile = new File([fileContent], 'import.json', {
      type: 'application/json'
    });
    const allBoards = [{ id: 'board-123' }];

    const result = await cboardImportAdapter(mockFile, {}, allBoards);

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0].prevId).toBe('board-123');
  });
});

describe('tests for obzImportAdapter', () => {
  let originalCreateObjectURL;

  beforeAll(() => {
    originalCreateObjectURL = global.URL.createObjectURL;
    global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
  });

  afterAll(() => {
    global.URL.createObjectURL = originalCreateObjectURL;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Must correctly import a board whose ID does not exist in the system using .obz', async () => {
    const zip = new JSZip();
    const boardId = 'new-board';
    const boardContent = {
      id: boardId,
      name: 'New Board from OBZ',
      buttons: []
    };
    zip.file('board1.obf', JSON.stringify(boardContent));
    const content = await zip.generateAsync({ type: 'arraybuffer' });

    const mockFile = new File([content], 'test.obz', {
      type: 'application/zip'
    });

    jest
      .spyOn(JSZipUtils, 'getBinaryContent')
      .mockImplementation((path, callback) => {
        callback(null, content);
      });

    const allBoards = [];
    const result = await obzImportAdapter(mockFile, {}, allBoards);

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(boardId);
  });

  test('Must ignore hidden boards when importing from .obz', async () => {
    const zip = new JSZip();
    const boardId = 'new-board';
    const boardContent = {
      id: boardId,
      name: 'New Board from OBZ',
      buttons: [],
      ext_cboard_hidden: true
    };
    zip.file('board1.obf', JSON.stringify(boardContent));
    const content = await zip.generateAsync({ type: 'arraybuffer' });

    const mockFile = new File([content], 'test.obz', {
      type: 'application/zip'
    });

    jest
      .spyOn(JSZipUtils, 'getBinaryContent')
      .mockImplementation((path, callback) => {
        callback(null, content);
      });

    const allBoards = [];
    const result = await obzImportAdapter(mockFile, {}, allBoards);

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(0);
  });

  test('Must ignore board with id "root" when importing from .obz', async () => {
    const zip = new JSZip();
    const boardContent = {
      id: 'root',
      name: 'Root Board',
      buttons: []
    };
    zip.file('board1.obf', JSON.stringify(boardContent));
    const content = await zip.generateAsync({ type: 'arraybuffer' });

    const mockFile = new File([content], 'test.obz', {
      type: 'application/zip'
    });

    jest
      .spyOn(JSZipUtils, 'getBinaryContent')
      .mockImplementation((path, callback) => {
        callback(null, content);
      });

    const allBoards = [];
    const result = await obzImportAdapter(mockFile, {}, allBoards);

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(0);
  });
  test('Must not discard board if the ID already exists (obz)', async () => {
    const zip = new JSZip();
    const boardContent = {
      id: 'board-123',
      name: 'Existing Board',
      buttons: []
    };
    zip.file('board1.obf', JSON.stringify(boardContent));
    const content = await zip.generateAsync({ type: 'arraybuffer' });

    const mockFile = new File([content], 'test.obz', {
      type: 'application/zip'
    });

    jest
      .spyOn(JSZipUtils, 'getBinaryContent')
      .mockImplementation((path, callback) => {
        callback(null, content);
      });

    const allBoards = [{ id: 'board-123' }];
    const result = await obzImportAdapter(mockFile, {}, allBoards);

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
  });

  test('Must generate a new ID if there is a collision using .obz', async () => {
    const zip = new JSZip();
    const boardContent = {
      id: 'board-123',
      name: 'Board with collision',
      buttons: []
    };
    zip.file('board1.obf', JSON.stringify(boardContent));
    const content = await zip.generateAsync({ type: 'arraybuffer' });

    const mockFile = new File([content], 'test.obz', {
      type: 'application/zip'
    });

    jest
      .spyOn(JSZipUtils, 'getBinaryContent')
      .mockImplementation((path, callback) => {
        callback(null, content);
      });

    const allBoards = [{ id: 'board-123' }];
    const result = await obzImportAdapter(mockFile, {}, allBoards);

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0].id).not.toBe('board-123');
    expect(result[0].id).toBeDefined();
  });

  test('Must save the old ID in the prevId property in case of collision', async () => {
    const zip = new JSZip();
    const boardContent = {
      id: 'board-123',
      name: 'Board with collision',
      buttons: []
    };
    zip.file('board1.obf', JSON.stringify(boardContent));
    const content = await zip.generateAsync({ type: 'arraybuffer' });

    const mockFile = new File([content], 'test.obz', {
      type: 'application/zip'
    });

    jest
      .spyOn(JSZipUtils, 'getBinaryContent')
      .mockImplementation((path, callback) => {
        callback(null, content);
      });

    const allBoards = [{ id: 'board-123' }];
    const result = await obzImportAdapter(mockFile, {}, allBoards);

    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(1);
    expect(result[0].prevId).toBe('board-123');
  });

  test('Must keep duplicated .obz boards separate when ids collide', async () => {
    const zip = new JSZip();
    zip.file(
      'board1.obf',
      JSON.stringify({
        id: 'board-123',
        name: 'First Board',
        buttons: []
      })
    );
    zip.file(
      'board2.obf',
      JSON.stringify({
        id: 'board-123',
        name: 'Second Board',
        buttons: []
      })
    );
    const content = await zip.generateAsync({ type: 'arraybuffer' });

    const mockFile = new File([content], 'test.obz', {
      type: 'application/zip'
    });

    jest
      .spyOn(shortid, 'generate')
      .mockReturnValueOnce('generated-board-1')
      .mockReturnValueOnce('generated-board-2');

    jest
      .spyOn(JSZipUtils, 'getBinaryContent')
      .mockImplementation((path, callback) => {
        callback(null, content);
      });

    const allBoards = [{ id: 'board-123' }];
    const result = await obzImportAdapter(mockFile, {}, allBoards);

    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'generated-board-1',
          prevId: 'board-123',
          name: 'First Board'
        }),
        expect.objectContaining({
          id: 'generated-board-2',
          prevId: 'board-123',
          name: 'Second Board'
        })
      ])
    );
  });
});

describe('tests for ImportContainer import flow', () => {
  test('Must rewrite loadBoard links after importing a board collision', async () => {
    const container = new ImportContainer({
      boards: [
        {
          id: 'existing-board',
          tiles: []
        }
      ],
      history: { goBack: jest.fn() },
      intl: { locale: 'en-US', formatMessage: jest.fn() },
      userData: {},
      currentCommunicator: { boards: [] },
      addBoards: jest.fn(),
      switchBoard: jest.fn(),
      verifyAndUpsertCommunicator: jest.fn(),
      upsertApiCommunicator: jest.fn()
    });

    const importedBoard = {
      id: 'renamed-board',
      prevId: 'existing-board',
      name: 'Imported Board',
      tiles: [
        {
          id: 'tile-1',
          loadBoard: 'existing-board'
        }
      ]
    };

    const updatedBoards = await container.updateLoadBoardsIds(
      [importedBoard],
      false
    );

    expect(updatedBoards).toHaveLength(1);
    expect(updatedBoards[0].tiles[0].loadBoard).toBe('renamed-board');
  });

  test('Must still create server boards correctly for logged-in users', async () => {
    const createBoardSpy = jest.spyOn(API, 'createBoard').mockResolvedValue({
      id: 'server-board-1',
      name: 'Server Board',
      tiles: []
    });

    const addBoards = jest.fn();
    const switchBoard = jest.fn();
    const addBoardsToCommunicator = jest
      .spyOn(ImportContainer.prototype, 'addBoardsToCommunicator')
      .mockResolvedValue();

    const container = new ImportContainer({
      boards: [],
      history: { goBack: jest.fn() },
      intl: { locale: 'pt-BR', formatMessage: jest.fn() },
      userData: {
        email: 'user@example.com',
        name: 'User Name'
      },
      currentCommunicator: { boards: [] },
      addBoards,
      switchBoard,
      verifyAndUpsertCommunicator: jest.fn(),
      upsertApiCommunicator: jest.fn()
    });

    await container.syncBoardsWithAPI([
      {
        id: 'local-board-1',
        name: 'Local Board',
        tiles: []
      }
    ]);

    expect(createBoardSpy).toHaveBeenCalledWith({
      name: 'Local Board',
      tiles: [],
      email: 'user@example.com',
      author: 'User Name',
      isPublic: false,
      locale: 'pt-BR'
    });
    expect(addBoards).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 'server-board-1',
        prevId: 'local-board-1'
      })
    ]);
    expect(switchBoard).toHaveBeenCalledWith('server-board-1');

    createBoardSpy.mockRestore();
    addBoardsToCommunicator.mockRestore();
  });
});
