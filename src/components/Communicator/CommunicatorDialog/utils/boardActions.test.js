import { getBoardActions } from './boardActions';
import { SECTIONS } from '../CommunicatorDialog.constants';

jest.mock('../CommunicatorDialog.messages', () => ({
  __esModule: true,
  default: new Proxy(
    {},
    {
      get: (target, prop) => ({
        id: String(prop),
        defaultMessage: String(prop)
      })
    }
  )
}));

const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };

const handlers = {
  onShow: jest.fn(),
  onSetRoot: jest.fn(),
  onAddRemove: jest.fn(),
  onShowInfo: jest.fn(),
  onReport: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onCopy: jest.fn(),
  onClone: jest.fn(),
  onExport: jest.fn(),
  onExportPdf: jest.fn(),
  onPublishToggle: jest.fn()
};

const build = (overrides = {}) =>
  getBoardActions({
    section: SECTIONS.MY_BOARDS,
    board: { id: 'b2', name: 'Comidas', email: 'me@cboard.io' },
    communicator: { rootBoard: 'b1', boards: ['b1'] },
    userData: { authToken: 't', email: 'me@cboard.io' },
    activeBoardId: 'b1',
    handlers,
    intl,
    ...overrides
  });

const keysOf = (actions) => actions.map((action) => action.key);

describe('getBoardActions', () => {
  it('returns a flat array', () => {
    expect(Array.isArray(build())).toBe(true);
  });

  it('lists My Boards actions with show first and delete last', () => {
    const keys = keysOf(build());
    expect(keys[0]).toBe('show');
    expect(keys[keys.length - 1]).toBe('delete');
    expect(keys).toEqual(
      expect.arrayContaining([
        'show',
        'edit',
        'clone',
        'export',
        'exportPdf',
        'publish',
        'setRoot',
        'addRemove',
        'info',
        'delete'
      ])
    );
  });

  it('ships clone disabled because the handler is not implemented yet', () => {
    const clone = build().find((action) => action.key === 'clone');
    expect(clone.disabled).toBe(true);
  });

  it('gives every action a label', () => {
    build().forEach((action) => {
      expect(typeof action.label).toBe('string');
      expect(action.label.length).toBeGreaterThan(0);
    });
  });

  it('disables delete for the root board', () => {
    const actions = build({ board: { id: 'b1', tiles: [] } });
    expect(actions.find((a) => a.key === 'delete').disabled).toBe(true);
  });

  it('disables delete for the active board', () => {
    const actions = build({
      board: { id: 'b9', tiles: [] },
      activeBoardId: 'b9'
    });
    expect(actions.find((a) => a.key === 'delete').disabled).toBe(true);
  });

  it('marks delete as destructive', () => {
    expect(build().find((a) => a.key === 'delete').destructive).toBe(true);
  });

  it('disables setRoot when the user is not authenticated', () => {
    const actions = build({ userData: {} });
    expect(actions.find((a) => a.key === 'setRoot').disabled).toBe(true);
  });

  it('lists the quick access toggle as Remove when the board is a member', () => {
    const actions = build({
      board: { id: 'b1', tiles: [] },
      communicator: { rootBoard: 'zzz', boards: ['b1'] }
    });
    expect(actions.find((a) => a.key === 'addRemove').label).toBe(
      'removeFromQuickAccess'
    );
  });

  it('exposes copy, info and report in the Community section', () => {
    const actions = build({ section: SECTIONS.COMMUNITY });
    expect(keysOf(actions)).toEqual(['copy', 'info', 'report']);
  });

  it('disables copying your own community board', () => {
    const actions = build({
      section: SECTIONS.COMMUNITY,
      board: { id: 'b2', email: 'me@cboard.io' }
    });
    expect(actions.find((a) => a.key === 'copy').disabled).toBe(true);
  });

  it('exposes setRoot, remove and info in the Quick access section', () => {
    const actions = build({ section: SECTIONS.MY_COMMUNICATOR });
    expect(keysOf(actions)).toEqual(['setRoot', 'addRemove', 'info']);
  });

  it('returns an empty array for an unknown section', () => {
    expect(build({ section: 'nope' })).toEqual([]);
  });
});
