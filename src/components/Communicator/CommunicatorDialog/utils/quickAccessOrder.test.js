import { swapBoardIds, moveVisibleBoard } from './quickAccessOrder';

describe('swapBoardIds', () => {
  it('swaps two ids in place', () => {
    expect(swapBoardIds(['a', 'b', 'c'], 'a', 'c')).toEqual(['c', 'b', 'a']);
  });

  it('returns the original array when an id is absent', () => {
    const ids = ['a', 'b'];
    expect(swapBoardIds(ids, 'a', 'zzz')).toBe(ids);
  });
});

describe('moveVisibleBoard', () => {
  it('moves a board up among the visible ids', () => {
    expect(moveVisibleBoard(['a', 'b', 'c'], ['a', 'b', 'c'], 'b', -1)).toEqual(
      ['b', 'a', 'c']
    );
  });

  it('moves a board down among the visible ids', () => {
    expect(moveVisibleBoard(['a', 'b', 'c'], ['a', 'b', 'c'], 'b', 1)).toEqual([
      'a',
      'c',
      'b'
    ]);
  });

  it('leaves hidden ids at their original index', () => {
    // 'hidden' is stored on the communicator but not rendered in the tray.
    const all = ['a', 'hidden', 'b', 'c'];
    const visible = ['a', 'b', 'c'];

    expect(moveVisibleBoard(all, visible, 'a', 1)).toEqual([
      'b',
      'hidden',
      'a',
      'c'
    ]);
  });

  it('is a no-op at the start of the visible list', () => {
    const all = ['a', 'b'];
    expect(moveVisibleBoard(all, ['a', 'b'], 'a', -1)).toBe(all);
  });

  it('is a no-op at the end of the visible list', () => {
    const all = ['a', 'b'];
    expect(moveVisibleBoard(all, ['a', 'b'], 'b', 1)).toBe(all);
  });

  it('is a no-op for an unknown id', () => {
    const all = ['a', 'b'];
    expect(moveVisibleBoard(all, ['a', 'b'], 'zzz', 1)).toBe(all);
  });
});
