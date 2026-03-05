import createReducer, {
  createMigratingStorage,
  boardMigrations
} from '../reducers';

describe('reducers', () => {
  it('should create Reducer', () => {
    const red = createReducer();
    expect(red).toBeDefined();
  });
});

const createMockStorage = () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
});

describe('createMigratingStorage', () => {
  let oldStorage, newStorage, storage;

  beforeEach(() => {
    oldStorage = createMockStorage();
    newStorage = createMockStorage();
    storage = createMigratingStorage(oldStorage, newStorage);
  });

  describe('getItem', () => {
    it('returns value from new storage when it exists, without touching old storage', async () => {
      newStorage.getItem.mockResolvedValue('new-data');

      const result = await storage.getItem('persist:root');

      expect(result).toBe('new-data');
      expect(oldStorage.getItem).not.toHaveBeenCalled();
      expect(oldStorage.removeItem).not.toHaveBeenCalled();
    });

    it('migrates from old to new storage when only old has the key', async () => {
      newStorage.getItem.mockResolvedValue(null);
      oldStorage.getItem.mockResolvedValue('legacy-data');
      newStorage.setItem.mockResolvedValue(undefined);
      oldStorage.removeItem.mockResolvedValue(undefined);

      const result = await storage.getItem('persist:root');

      expect(result).toBe('legacy-data');
      expect(newStorage.setItem).toHaveBeenCalledWith(
        'persist:root',
        'legacy-data'
      );
      expect(oldStorage.removeItem).toHaveBeenCalledWith('persist:root');
    });

    it('returns null when neither storage has the key', async () => {
      newStorage.getItem.mockResolvedValue(null);
      oldStorage.getItem.mockResolvedValue(null);

      const result = await storage.getItem('persist:root');

      expect(result).toBeNull();
    });

    it('falls back to old storage when new storage read fails', async () => {
      newStorage.getItem.mockRejectedValue(new Error('IndexedDB error'));
      oldStorage.getItem.mockResolvedValue('legacy-data');
      newStorage.setItem.mockResolvedValue(undefined);
      oldStorage.removeItem.mockResolvedValue(undefined);

      const result = await storage.getItem('persist:root');

      expect(result).toBe('legacy-data');
      expect(newStorage.setItem).toHaveBeenCalledWith(
        'persist:root',
        'legacy-data'
      );
    });

    it('returns old value but does not remove from old storage when migration write fails', async () => {
      newStorage.getItem.mockResolvedValue(null);
      oldStorage.getItem.mockResolvedValue('legacy-data');
      newStorage.setItem.mockRejectedValue(new Error('write failed'));

      const result = await storage.getItem('persist:root');

      expect(result).toBe('legacy-data');
      expect(oldStorage.removeItem).not.toHaveBeenCalled();
    });
  });

  describe('setItem', () => {
    it('delegates to new storage only', async () => {
      newStorage.setItem.mockResolvedValue(undefined);

      await storage.setItem('persist:root', 'data');

      expect(newStorage.setItem).toHaveBeenCalledWith('persist:root', 'data');
      expect(oldStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('removeItem', () => {
    it('delegates to new storage only', async () => {
      newStorage.removeItem.mockResolvedValue(undefined);

      await storage.removeItem('persist:root');

      expect(newStorage.removeItem).toHaveBeenCalledWith('persist:root');
      expect(oldStorage.removeItem).not.toHaveBeenCalled();
    });
  });
});

describe('boardMigrations', () => {
  describe('migration 1 – syncMeta default', () => {
    it('defaults syncMeta to {} when missing from persisted state', () => {
      const state = {
        board: {
          boards: [{ id: 'board-1' }]
        }
      };

      const result = boardMigrations[1](state);

      expect(result.board.syncMeta).toEqual({});
      expect(result.board.boards).toEqual([{ id: 'board-1' }]);
    });

    it('preserves existing syncMeta when present', () => {
      const existingSyncMeta = {
        'board-1': { status: 'PENDING', isDeleted: false }
      };
      const state = {
        board: {
          boards: [{ id: 'board-1' }],
          syncMeta: existingSyncMeta
        }
      };

      const result = boardMigrations[1](state);

      expect(result.board.syncMeta).toEqual(existingSyncMeta);
    });

    it('defaults syncMeta to {} when board state is undefined', () => {
      const state = {};

      const result = boardMigrations[1](state);

      expect(result.board.syncMeta).toEqual({});
    });
  });
});
