import { getGridRowKey, getGridCellKey } from './utils';

describe('FixedGrid stable key helpers', () => {
  describe('getGridRowKey', () => {
    it('derives the key from the first tile id, independent of the row index', () => {
      const row = [{ id: 'c' }, { id: 'd' }];
      expect(getGridRowKey(row, 0)).toBe('row-c');
      // Same content at a different position must produce the same key.
      expect(getGridRowKey(row, 1)).toBe(getGridRowKey(row, 0));
    });

    it('keeps a surviving row key constant when an earlier row is removed', () => {
      // Grid [[a,b],[c,d]] -> the [c,d] row lives at index 1.
      const before = getGridRowKey([{ id: 'c' }, { id: 'd' }], 1);
      // After removing the first row, [[c,d]] -> the same row is now at index 0.
      const after = getGridRowKey([{ id: 'c' }, { id: 'd' }], 0);
      // Stable: no remount. (Index-based keys would change from 1 to 0.)
      expect(after).toBe(before);
    });

    it('uses the first non-empty tile when leading cells are empty', () => {
      expect(getGridRowKey([null, { id: 'x' }], 3)).toBe('row-x');
    });

    it('falls back to a unique position key for a fully empty row', () => {
      expect(getGridRowKey([null, null], 2)).toBe('row-empty-2');
      expect(getGridRowKey([undefined, undefined], 4)).toBe('row-empty-4');
    });
  });

  describe('getGridCellKey', () => {
    it('derives a stable key from the tile id, independent of position', () => {
      expect(getGridCellKey({ id: 'a' }, 0, 0)).toBe('cell-a');
      expect(getGridCellKey({ id: 'a' }, 5, 9)).toBe('cell-a');
    });

    it('falls back to a unique position key for an empty cell', () => {
      expect(getGridCellKey(null, 1, 2)).toBe('cell-empty-1-2');
      expect(getGridCellKey(undefined, 0, 0)).toBe('cell-empty-0-0');
    });
  });

  it('produces collision-free keys across a grid mixing tiles and empty cells', () => {
    const grid = [[{ id: 'a' }, null], [null, { id: 'b' }], [null, null]];
    const rowKeys = grid.map((row, r) => getGridRowKey(row, r));
    const cellKeys = grid.flatMap((row, r) =>
      row.map((cell, c) => getGridCellKey(cell, r, c))
    );
    const allKeys = [...rowKeys, ...cellKeys];
    expect(new Set(allKeys).size).toBe(allKeys.length);
  });
});
