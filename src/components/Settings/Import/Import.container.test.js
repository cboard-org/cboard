import { ImportContainer } from './Import.container';

// prepareLocalBoard is a pure instance method (it does not read this.props),
// so it can be exercised on a bare instance without a Redux store or render.
const makeInstance = () => new ImportContainer({});

describe('ImportContainer.prepareLocalBoard', () => {
  test('assigns a fresh id and remembers the original as prevId', () => {
    const instance = makeInstance();
    const result = instance.prepareLocalBoard({
      id: 'original-id',
      name: 'My board'
    });

    expect(result.id).toBeDefined();
    expect(result.id).not.toBe('original-id');
    expect(result.prevId).toBe('original-id');
    expect(result.name).toBe('My board');
  });

  test('clears a foreign email so the board is not left stuck PENDING on sync (issue #2231)', () => {
    const instance = makeInstance();
    const result = instance.prepareLocalBoard({
      id: 'imported-id',
      name: 'Imported board',
      email: 'previous-owner@example.com'
    });

    // A foreign email makes classifyBoardsForPush skip the board during sync,
    // leaving it PENDING forever. Normalizing to an empty string marks it as
    // locally owned so it graduates to the current user on the next sync.
    expect(result.email).toBe('');
  });
});
