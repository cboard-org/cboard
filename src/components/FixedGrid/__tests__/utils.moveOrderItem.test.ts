import { moveOrderItem, GridOrder } from '../utils';

function grid(rows: GridOrder): GridOrder {
  return rows;
}

describe('moveOrderItem (original version)', () => {
  describe('White-box — decision coverage of D1 (loop) and D2 (search if)', () => {
    it('CT1: finds the item in the first row and swaps immediately', () => {
      const order = grid([
        ['x', 'y'],
        ['z', 'w']
      ]);

      const result = moveOrderItem('y', { row: 1, column: 0 }, order);

      expect(result[0][1]).toBe('z');
      expect(result[1][0]).toBe('y');
    });

    it('CT2: does not find the item in the first row, but finds it in a later row', () => {
      const order = grid([
        ['x', 'y'],
        ['z', 'w'],
        ['t', null]
      ]);

      const result = moveOrderItem('w', { row: 0, column: 0 }, order);

      expect(result[0][0]).toBe('w');
      expect(result[1][1]).toBe('x');
    });

    it('CT3: does not find the item in any row (loop is exhausted without break)', () => {
      const order = grid([
        ['x', 'y'],
        ['z', 'w']
      ]);

      const result = moveOrderItem('nonexistent', { row: 1, column: 1 }, order);

      expect(result[1][1]).toBe('nonexistent');
    });
  });

  describe('Black-box (EC/BV) — functional complement of the structural cases', () => {
    it('CT4 [functional reinforcement of CT1]: the swap preserves all ids present in the grid', () => {
      const order = grid([
        ['a', 'b'],
        ['c', 'd']
      ]);
      const idsBefore = order.flat().filter(Boolean).sort();

      const result = moveOrderItem('d', { row: 0, column: 0 }, order);
      const idsAfter = result.flat().filter(Boolean).sort();

      expect(idsAfter).toEqual(idsBefore);
    });

    it('CT5 [EC2]: is idempotent when the item is already at the destination position', () => {
      const order = grid([
        ['a', 'b'],
        ['c', 'd']
      ]);

      const result = moveOrderItem('a', { row: 0, column: 0 }, order);

      expect(result).toEqual(order);
    });

    it('CT6 [EC5]: moves the item to an empty cell and frees the source position', () => {
      const order = grid([
        ['a', null],
        ['c', 'd']
      ]);

      const result = moveOrderItem('d', { row: 0, column: 1 }, order);

      expect(result).toEqual([
        ['a', 'd'],
        ['c', null]
      ]);
    });

    it('CT7 [EC4 — defect found]: loses the destination item when itemId does not exist in the grid', () => {
      const order = grid([
        ['a', 'b'],
        ['c', 'd']
      ]);

      const result = moveOrderItem('new-tile', { row: 0, column: 0 }, order);

      expect(result).toEqual([
        ['new-tile', 'b'],
        ['c', 'd']
      ]);
      expect(result.flat()).not.toContain('a');
    });

    it('CT8 [BV1]: accepts the lower boundary position (0,0)', () => {
      const order = grid([
        ['a', 'b'],
        ['c', 'd']
      ]);

      const result = moveOrderItem('d', { row: 0, column: 0 }, order);

      expect(result[0][0]).toBe('d');
    });

    it('CT9 [BV2]: accepts the upper boundary position (last row/column)', () => {
      const order = grid([
        ['a', 'b'],
        ['c', 'd']
      ]);
      const lastRow = order.length - 1;
      const lastColumn = order[0].length - 1;

      const result = moveOrderItem(
        'a',
        { row: lastRow, column: lastColumn },
        order
      );

      expect(result[lastRow][lastColumn]).toBe('a');
    });

    it('CT10 [BV3]: works on a minimal 1x1 grid', () => {
      const order = grid([['a']]);

      const result = moveOrderItem('a', { row: 0, column: 0 }, order);

      expect(result).toEqual([['a']]);
    });

    it('CT11 [BV4 — defect found]: throws an exception when moving to a position outside the grid limits', () => {
      const order = grid([
        ['a', 'b'],
        ['c', 'd']
      ]);

      expect(() => moveOrderItem('a', { row: 5, column: 5 }, order)).toThrow();
    });
  });

  it('CT12: does not mutate the original `order` matrix (only returns a new matrix)', () => {
    const order = grid([
      ['a', 'b'],
      ['c', 'd']
    ]);
    const snapshot = JSON.parse(JSON.stringify(order));

    moveOrderItem('d', { row: 0, column: 0 }, order);

    expect(order).toEqual(snapshot);
  });
});
