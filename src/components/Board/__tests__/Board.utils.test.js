import { hasUnsyncedChildReference } from '../Board.utils';
import { DEFAULT_BOARD_EMAIL } from '../Board.constants';

const localChild = { id: 'local1', tiles: [] };
const serverChild = { id: 'server-board-id-123456', tiles: [] };
const defaultBoard = { id: 'root', email: DEFAULT_BOARD_EMAIL, tiles: [] };

const parentLinkingTo = childId => ({
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
