import {
  computeScrollState,
  hasUnsyncedChildReference,
  processTileClick
} from '../Board.utils';
import { DEFAULT_BOARD_EMAIL } from '../Board.constants';

const localChild = { id: 'local1', tiles: [] };
const serverChild = { id: 'server-board-id-123456', tiles: [] };
const defaultBoard = { id: 'root', email: DEFAULT_BOARD_EMAIL, tiles: [] };

const parentLinkingTo = (childId) => ({
  id: 'parent1',
  tiles: [{ id: 't1', loadBoard: childId }]
});

describe('hasUnsyncedChildReference', () => {
  it('returns false when board is missing', () => {
    expect(hasUnsyncedChildReference(undefined, [localChild])).toBe(false);
    expect(hasUnsyncedChildReference(null, [localChild])).toBe(false);
  });

  it('returns false when board has no tiles array', () => {
    expect(hasUnsyncedChildReference({ id: 'parent1' }, [localChild])).toBe(
      false
    );
    expect(
      hasUnsyncedChildReference({ id: 'parent1', tiles: null }, [localChild])
    ).toBe(false);
  });

  it('returns false when board has an empty tiles array', () => {
    expect(
      hasUnsyncedChildReference({ id: 'parent1', tiles: [] }, [localChild])
    ).toBe(false);
  });

  it('returns false when there are no unsynced local boards', () => {
    const parent = parentLinkingTo('server-board-id-123456');
    expect(hasUnsyncedChildReference(parent, [serverChild])).toBe(false);
  });

  it('returns true when a tile points to a local (unsynced) child board', () => {
    const parent = parentLinkingTo('local1');
    expect(hasUnsyncedChildReference(parent, [localChild])).toBe(true);
  });

  it('returns false when the referenced child is a server board', () => {
    const parent = parentLinkingTo('server-board-id-123456');
    expect(hasUnsyncedChildReference(parent, [localChild, serverChild])).toBe(
      false
    );
  });

  it('ignores references to shipped default boards', () => {
    const parent = parentLinkingTo('root');
    expect(hasUnsyncedChildReference(parent, [defaultBoard])).toBe(false);
  });

  it('returns false when no tile has a loadBoard reference', () => {
    const parent = { id: 'parent1', tiles: [{ id: 't1', loadBoard: '' }] };
    expect(hasUnsyncedChildReference(parent, [localChild])).toBe(false);
  });

  it('ignores null tiles when scanning for references', () => {
    const parent = {
      id: 'parent1',
      tiles: [null, { id: 't1', loadBoard: 'local1' }]
    };
    expect(hasUnsyncedChildReference(parent, [localChild])).toBe(true);
  });

  it('defaults boards to an empty list', () => {
    const parent = parentLinkingTo('local1');
    expect(hasUnsyncedChildReference(parent)).toBe(false);
  });
});

describe('computeScrollState', () => {
  describe('white-box branch coverage', () => {
    it('CB01: does not scroll when the item count equals the row capacity', () => {
      const state = computeScrollState(12, 4, 3);

      expect(state.isScroll).toBe(false);
    });
  });

  describe('black-box characterization', () => {
    it('CP01: reports no scroll when the item count is below capacity', () => {
      expect(computeScrollState(11, 4, 3)).toEqual({
        isScroll: false,
        totalRows: 3
      });
    });

    it('CP02: reports no scroll when the item count exactly fills the rows', () => {
      expect(computeScrollState(12, 4, 3)).toEqual({
        isScroll: false,
        totalRows: 3
      });
    });

    it('CP03: reports scroll when one item exceeds the row capacity', () => {
      expect(computeScrollState(13, 4, 3)).toEqual({
        isScroll: true,
        totalRows: 4
      });
    });

    it('CP04: returns zero rows and no scroll for an empty board', () => {
      expect(computeScrollState(0, 4, 3)).toEqual({
        isScroll: false,
        totalRows: 0
      });
    });

    it('CP05: returns one row for a single item', () => {
      expect(computeScrollState(1, 1, 3)).toEqual({
        isScroll: false,
        totalRows: 1
      });
    });

    it('CP06: counts all rows when the board exceeds capacity by several rows', () => {
      expect(computeScrollState(25, 4, 3)).toEqual({
        isScroll: true,
        totalRows: 7
      });
    });

    it('CP07: allows zero visible rows and reports scroll for a non-empty board', () => {
      expect(computeScrollState(1, 4, 0)).toEqual({
        isScroll: true,
        totalRows: 1
      });
    });
  });

  describe('TDD01: columns must be a positive integer', () => {
    it.each([0, -1, 1.5, NaN, Infinity])(
      'throws RangeError when cols is %s',
      (cols) => {
        expect(() => computeScrollState(1, cols, 3)).toThrow(RangeError);
      }
    );
  });

  describe('TDD02: item count and row limit must be non-negative integers', () => {
    it.each([
      [-1, 4, 3],
      [1.5, 4, 3],
      [NaN, 4, 3],
      [1, 4, -1],
      [1, 4, Infinity]
    ])(
      'throws RangeError for itemCount=%s, cols=%s, rows=%s',
      (itemCount, cols, rows) => {
        expect(() => computeScrollState(itemCount, cols, rows)).toThrow(
          RangeError
        );
      }
    );
  });

  describe('additional post-TDD checks', () => {
    it('RF01: rejects a numeric string as the item count', () => {
      expect(() => computeScrollState('4', 4, 3)).toThrow(RangeError);
    });

    it('RF02: rejects a null row limit', () => {
      expect(() => computeScrollState(1, 4, null)).toThrow(RangeError);
    });

    it('RF03: rejects an empty string as the item count', () => {
      expect(() => computeScrollState('', 4, 3)).toThrow(RangeError);
    });

    it('RF04: rejects an undefined item count', () => {
      expect(() => computeScrollState(undefined, 4, 3)).toThrow(RangeError);
    });

    it('RF05: rejects an undefined column count', () => {
      expect(() => computeScrollState(1, undefined, 3)).toThrow(RangeError);
    });

    it('RF06: rejects a Symbol row limit', () => {
      expect(() => computeScrollState(1, 4, Symbol('rows'))).toThrow(
        RangeError
      );
    });
  });
});

describe('processTileClick', () => {
  const createParams = (overrides = {}) => ({
    tile: { label: 'Bola', vocalization: 'Bola' },
    boards: [],
    output: [],
    speak: jest.fn(),
    changeBoard: jest.fn(),
    changeOutput: jest.fn(),
    clickSymbol: jest.fn(),
    onNavigate: jest.fn(),
    onBoardNotFound: jest.fn(),
    ...overrides
  });

  const expectNoCallbacksCalled = (params) => {
    expect(params.speak).not.toHaveBeenCalled();
    expect(params.changeBoard).not.toHaveBeenCalled();
    expect(params.changeOutput).not.toHaveBeenCalled();
    expect(params.clickSymbol).not.toHaveBeenCalled();
    expect(params.onNavigate).not.toHaveBeenCalled();
    expect(params.onBoardNotFound).not.toHaveBeenCalled();
  };

  describe('folder tiles (loadBoard)', () => {
    it('CT01: navigates to the folder found by id and vocalizes it', () => {
      const params = createParams({
        tile: { loadBoard: 'b1', vocalization: 'Casa' },
        boards: [{ id: 'b1' }],
        navigationSettings: { vocalizeFolders: true }
      });

      const result = processTileClick(params);

      expect(result).toEqual({ navigated: true, nextBoardId: 'b1' });
      expect(params.changeBoard).toHaveBeenCalledTimes(1);
      expect(params.changeBoard).toHaveBeenCalledWith('b1');
      expect(params.onNavigate).toHaveBeenCalledTimes(1);
      expect(params.onNavigate).toHaveBeenCalledWith('b1');
      expect(params.speak).toHaveBeenCalledTimes(1);
      expect(params.speak).toHaveBeenCalledWith('Casa');
      expect(params.onBoardNotFound).not.toHaveBeenCalled();
      expect(params.clickSymbol).not.toHaveBeenCalled();
      expect(params.changeOutput).not.toHaveBeenCalled();
    });

    it('CT02: navigates to the folder found only by name without vocalizing when optional callbacks are missing', () => {
      const params = createParams({
        tile: { loadBoard: 'x', label: 'Casa' },
        boards: [
          { id: 'b1', name: 'A' },
          { id: 'b2', name: 'B' },
          { id: 'b3', name: 'Casa' }
        ],
        navigationSettings: { vocalizeFolders: false },
        changeBoard: null,
        onNavigate: undefined,
        speak: undefined
      });

      const result = processTileClick(params);

      expect(result).toEqual({ navigated: true, nextBoardId: 'b3' });
    });

    it('CT03: prioritizes the id over the name and does not vocalize a folder whose action starts with +', () => {
      const params = createParams({
        tile: {
          loadBoard: 'b1',
          label: 'Casa',
          action: '+',
          vocalization: 'Casa'
        },
        boards: [
          { id: 'b2', name: 'Casa' },
          { id: 'b1', name: 'X' }
        ],
        navigationSettings: { vocalizeFolders: true }
      });

      const result = processTileClick(params);

      expect(result).toEqual({ navigated: true, nextBoardId: 'b1' });
      expect(params.changeBoard).toHaveBeenCalledWith('b1');
      expect(params.onNavigate).toHaveBeenCalledWith('b1');
      expect(params.speak).not.toHaveBeenCalled();
    });

    it('CT04: calls onBoardNotFound when the boards list is empty', () => {
      const params = createParams({
        tile: { loadBoard: 'b9', label: 'Casa' },
        boards: []
      });

      const result = processTileClick(params);

      expect(result).toEqual({ navigated: false });
      expect(params.onBoardNotFound).toHaveBeenCalledTimes(1);
      expect(params.onBoardNotFound).toHaveBeenCalledWith(params.tile);
      expect(params.changeBoard).not.toHaveBeenCalled();
      expect(params.onNavigate).not.toHaveBeenCalled();
      expect(params.speak).not.toHaveBeenCalled();
    });

    it('CT05: returns not navigated without errors when there is no target and navigationSettings and onBoardNotFound are omitted', () => {
      const params = createParams({
        tile: { loadBoard: 'b9', label: 'Casa' },
        boards: [{ id: 'b1', name: 'Outra' }],
        navigationSettings: undefined,
        onBoardNotFound: undefined
      });

      const result = processTileClick(params);

      expect(result).toEqual({ navigated: false });
    });

    describe('folder vocalization', () => {
      const originalAudio = global.Audio;
      let playMock;

      beforeEach(() => {
        playMock = jest.fn().mockResolvedValue();
        global.Audio = jest.fn(function () {
          this.play = playMock;
        });
      });

      afterEach(() => {
        global.Audio = originalAudio;
      });

      it('CT06: plays the sound file of the folder instead of using TTS', () => {
        const params = createParams({
          tile: { loadBoard: 'b1', sound: 'a.mp3' },
          boards: [{ id: 'b1' }],
          navigationSettings: { vocalizeFolders: true }
        });

        const result = processTileClick(params);

        expect(result).toEqual({ navigated: true, nextBoardId: 'b1' });
        expect(global.Audio).toHaveBeenCalledTimes(1);
        expect(global.Audio.mock.instances[0].src).toBe('a.mp3');
        expect(playMock).toHaveBeenCalledTimes(1);
        expect(params.speak).not.toHaveBeenCalled();
      });
    });

    it('CT07: vocalizes the label of the folder when there is no vocalization', () => {
      const params = createParams({
        tile: { loadBoard: 'b1', label: 'Casa' },
        boards: [{ id: 'b1' }],
        navigationSettings: { vocalizeFolders: true }
      });

      const result = processTileClick(params);

      expect(result).toEqual({ navigated: true, nextBoardId: 'b1' });
      expect(params.speak).toHaveBeenCalledTimes(1);
      expect(params.speak).toHaveBeenCalledWith('Casa');
    });

    it('CT08: does not vocalize the folder when vocalization and label are empty', () => {
      const params = createParams({
        tile: { loadBoard: 'b1', vocalization: '', label: '' },
        boards: [{ id: 'b1' }],
        navigationSettings: { vocalizeFolders: true }
      });

      const result = processTileClick(params);

      expect(result).toEqual({ navigated: true, nextBoardId: 'b1' });
      expect(params.speak).not.toHaveBeenCalled();
    });
  });

  describe('symbol tiles (no loadBoard)', () => {
    it('CT09: registers the click, vocalizes the symbol and updates the output', () => {
      const params = createParams({
        tile: { label: 'Bola', vocalization: 'Bola' },
        output: [],
        isLiveMode: undefined,
        navigationSettings: undefined
      });

      const result = processTileClick(params);

      expect(result).toEqual({ navigated: false });
      expect(params.clickSymbol).toHaveBeenCalledTimes(1);
      expect(params.clickSymbol).toHaveBeenCalledWith('Bola');
      expect(params.speak).toHaveBeenCalledTimes(1);
      expect(params.speak).toHaveBeenCalledWith('Bola');
      expect(params.changeOutput).toHaveBeenCalledTimes(1);
      expect(params.changeOutput).toHaveBeenCalledWith([params.tile]);
      expect(params.changeBoard).not.toHaveBeenCalled();
      expect(params.onNavigate).not.toHaveBeenCalled();
      expect(params.onBoardNotFound).not.toHaveBeenCalled();
    });

    it('CT10: appends the live marker to the output in quiet builder mode without vocalizing', () => {
      const existing = { id: 'e1', label: 'Eu' };
      const params = createParams({
        tile: { label: 'Bola', vocalization: 'Bola', action: 'foo' },
        output: [existing],
        isLiveMode: true,
        generateId: () => 'L1',
        navigationSettings: { quietBuilderMode: true }
      });

      const result = processTileClick(params);

      expect(result).toEqual({ navigated: false });
      expect(params.clickSymbol).toHaveBeenCalledWith('Bola');
      expect(params.speak).not.toHaveBeenCalled();
      expect(params.changeOutput).toHaveBeenCalledTimes(1);
      const newOutput = params.changeOutput.mock.calls[0][0];
      expect(newOutput).toHaveLength(3);
      expect(newOutput[0]).toBe(existing);
      expect(newOutput[1]).toBe(params.tile);
      expect(newOutput[2]).toEqual(
        expect.objectContaining({ type: 'live', id: 'L1' })
      );
    });

    it('CT11: does not vocalize a symbol whose action starts with +', () => {
      const params = createParams({
        tile: { label: 'Bola', vocalization: 'Bola', action: '+' },
        output: [],
        isLiveMode: false,
        navigationSettings: { quietBuilderMode: false }
      });

      const result = processTileClick(params);

      expect(result).toEqual({ navigated: false });
      expect(params.clickSymbol).toHaveBeenCalledTimes(1);
      expect(params.speak).not.toHaveBeenCalled();
      expect(params.changeOutput).toHaveBeenCalledWith([params.tile]);
    });

    it('CT12: treats an action with a leading space as a regular action and vocalizes a one-space label', () => {
      const params = createParams({
        tile: { label: ' ', action: ' +' },
        output: []
      });

      const result = processTileClick(params);

      expect(result).toEqual({ navigated: false });
      expect(params.speak).toHaveBeenCalledTimes(1);
      expect(params.speak).toHaveBeenCalledWith(' ');
      expect(params.changeOutput).toHaveBeenCalledWith([params.tile]);
    });

    it('CT13: processes a symbol without errors when speak, clickSymbol and changeOutput are omitted', () => {
      const params = createParams({
        tile: { label: 'Bola' },
        output: [],
        isLiveMode: undefined,
        speak: undefined,
        clickSymbol: undefined,
        changeOutput: undefined
      });

      const result = processTileClick(params);

      expect(result).toEqual({ navigated: false });
    });
  });

  describe('invalid inputs', () => {
    it('CT14: throws when the tile is null', () => {
      const params = createParams({ tile: null });

      expect(() => processTileClick(params)).toThrow(TypeError);
      expectNoCallbacksCalled(params);
    });

    it('CT15: throws when boards is not an array in the folder flow', () => {
      const params = createParams({
        tile: { loadBoard: 'b1' },
        boards: undefined
      });

      expect(() => processTileClick(params)).toThrow(TypeError);
      expectNoCallbacksCalled(params);
    });

    it('CT16: throws when navigationSettings is null (default only applies to undefined)', () => {
      const params = createParams({
        tile: { loadBoard: 'b1' },
        boards: [{ id: 'b1' }],
        navigationSettings: null
      });

      expect(() => processTileClick(params)).toThrow(TypeError);
      expect(params.changeBoard).toHaveBeenCalledWith('b1');
      expect(params.onNavigate).toHaveBeenCalledWith('b1');
    });

    it('CT17: throws when live mode is active without generateId', () => {
      const params = createParams({
        tile: { label: 'Bola', vocalization: 'Bola' },
        output: [],
        isLiveMode: true,
        generateId: undefined
      });

      expect(() => processTileClick(params)).toThrow(TypeError);
      expect(params.clickSymbol).toHaveBeenCalledWith('Bola');
      expect(params.speak).toHaveBeenCalledWith('Bola');
      expect(params.changeOutput).not.toHaveBeenCalled();
    });

    it('CT18: throws when output is not an array in the symbol flow', () => {
      const params = createParams({
        tile: { label: 'Bola' },
        output: undefined,
        isLiveMode: false
      });

      expect(() => processTileClick(params)).toThrow(TypeError);
      expect(params.changeOutput).not.toHaveBeenCalled();
    });

    it('CT19: throws when the tile action is not a string', () => {
      const params = createParams({ tile: { label: 'Bola', action: 123 } });

      expect(() => processTileClick(params)).toThrow(TypeError);
      expectNoCallbacksCalled(params);
    });

    it('CT20: throws when a callback is not a function', () => {
      const params = createParams({
        tile: { loadBoard: 'b1' },
        boards: [{ id: 'b1' }],
        changeBoard: 'abc'
      });

      expect(() => processTileClick(params)).toThrow(TypeError);
      expect(params.onNavigate).not.toHaveBeenCalled();
    });
  });
});
