import API from '../../../api';
import { BoardContainer } from '../Board.container';
import { CommunicatorDialogContainer } from '../../Communicator/CommunicatorDialog/CommunicatorDialog.container';

jest.mock('../../../api', () => ({ getBoard: jest.fn() }));
jest.mock('dom-to-image', () => ({}));
jest.mock('../Board.component', () => () => null);
jest.mock(
  '../../Communicator/CommunicatorDialog/CommunicatorDialog.component',
  () => () => null
);

const child = { id: 'child', name: 'Cached child', tiles: [] };
const parent = {
  id: 'parent',
  name: 'Parent',
  tiles: [{ id: 'child-tile', loadBoard: 'child' }]
};
const clone = (value) => JSON.parse(JSON.stringify(value));

function setup(Container, availableBoards = [child]) {
  const boards = clone(availableBoards);
  const props = {
    boards,
    availableBoards: boards,
    communicatorBoards: boards,
    communicator: { id: 'communicator' },
    currentCommunicator: { id: 'communicator' },
    userData: {},
    createBoard: jest.fn((board) => boards.push(clone(board))),
    updateBoard: jest.fn(),
    addBoardCommunicator: jest.fn(),
    verifyAndUpsertCommunicator: jest.fn()
  };
  return { instance: new Container(props), boards, props };
}

describe.each([
  ['Board', BoardContainer],
  ['Communicator', CommunicatorDialogContainer]
])('%s recursive board copying', (_name, Container) => {
  beforeEach(() => API.getBoard.mockReset());

  it.each([
    ['a network error', new Error('Network unavailable')],
    ['404', { response: { status: 404 } }],
    ['401', { response: { status: 401 } }],
    ['500', { response: { status: 500 } }]
  ])('copies the cached child after %s', async (_description, error) => {
    API.getBoard.mockRejectedValue(error);
    const { instance, boards, props } = setup(Container);

    await instance.createBoardsRecursively(clone(parent));

    expect(API.getBoard).toHaveBeenCalledWith('child');
    expect(props.createBoard).toHaveBeenCalledTimes(2);
    const copiedParent = boards.find((board) => board.name === 'Parent');
    const copiedChild = boards.find(
      (board) => board.name === 'Cached child' && board.id !== 'child'
    );
    expect(copiedChild).toBeDefined();
    expect(copiedParent.tiles[0].loadBoard).toBe(copiedChild.id);
    expect(props.addBoardCommunicator).toHaveBeenCalledTimes(1);
    expect(props.addBoardCommunicator).toHaveBeenCalledWith(copiedParent.id);
  });

  it('uses the fetched child when the API succeeds', async () => {
    API.getBoard.mockResolvedValue({ ...child, name: 'Fetched child' });
    const { instance, boards, props } = setup(Container);

    await instance.createBoardsRecursively(clone(parent));

    expect(props.createBoard).toHaveBeenCalledTimes(2);
    const copiedParent = boards.find((board) => board.name === 'Parent');
    const copiedChild = boards.find((board) => board.name === 'Fetched child');
    expect(copiedParent.tiles[0].loadBoard).toBe(copiedChild.id);
    expect(props.createBoard).not.toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Cached child' })
    );
  });

  it('continues with sibling boards when no cached child is available', async () => {
    API.getBoard.mockRejectedValueOnce({ response: { status: 500 } });
    API.getBoard.mockResolvedValueOnce({
      id: 'sibling',
      name: 'Sibling',
      tiles: []
    });
    const { instance, boards, props } = setup(Container, []);
    const source = clone(parent);
    source.tiles.push({ id: 'sibling-tile', loadBoard: 'sibling' });

    await instance.createBoardsRecursively(source);

    expect(API.getBoard.mock.calls).toEqual([['child'], ['sibling']]);
    expect(props.createBoard).toHaveBeenCalledTimes(2);
    const copiedParent = boards.find((board) => board.name === 'Parent');
    const copiedSibling = boards.find((board) => board.name === 'Sibling');
    expect(copiedParent.tiles[1].loadBoard).toBe(copiedSibling.id);
  });
});
