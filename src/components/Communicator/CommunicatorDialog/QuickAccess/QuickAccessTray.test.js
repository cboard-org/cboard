import React from 'react';
import { mount } from 'enzyme';
import IconButton from '@material-ui/core/IconButton';
import QuickAccessTray from './QuickAccessTray';

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

jest.mock('../shared/BoardThumb', () => ({
  __esModule: true,
  default: () => null
}));

const intl = {
  formatMessage: ({ defaultMessage }) => defaultMessage
};

const boards = [
  { id: 'b1', name: 'General', tiles: [] },
  { id: 'b2', name: 'Comidas', tiles: [] },
  { id: 'b3', name: 'Escuela', tiles: [] }
];

const render = (props = {}) =>
  mount(
    <QuickAccessTray
      intl={intl}
      boards={boards}
      communicator={{ rootBoard: 'b1', boards: ['b3', 'b1', 'b2'] }}
      activeBoardId={null}
      busyBoardId={null}
      onSetRoot={jest.fn()}
      onRemove={jest.fn()}
      onMove={jest.fn()}
      onGoToMyBoards={jest.fn()}
      {...props}
    />
  );

const namesOf = (wrapper) =>
  wrapper.find('QuickAccessRow').map((row) => row.prop('board').name);

const moveButtons = (wrapper, index) =>
  wrapper.find('QuickAccessRow').at(index).find(IconButton);

describe('QuickAccessTray', () => {
  it('renders rows in communicator order', () => {
    expect(namesOf(render())).toEqual(['Escuela', 'General', 'Comidas']);
  });

  it('skips communicator ids with no matching board', () => {
    const wrapper = render({
      communicator: { rootBoard: 'b1', boards: ['b3', 'missing', 'b1'] }
    });
    expect(namesOf(wrapper)).toEqual(['Escuela', 'General']);
  });

  it('renders the empty state when nothing is in quick access', () => {
    const wrapper = render({
      communicator: { rootBoard: null, boards: [] }
    });
    expect(wrapper.text()).toContain('quickAccessEmpty');
    expect(wrapper.find('QuickAccessRow')).toHaveLength(0);
  });

  it('disables Move up on the first row', () => {
    const up = moveButtons(render(), 0).filterWhere(
      (node) => node.prop('data-testid') === 'move-up'
    );
    expect(up.first().prop('disabled')).toBe(true);
  });

  it('disables Move down on the last row', () => {
    const down = moveButtons(render(), 2).filterWhere(
      (node) => node.prop('data-testid') === 'move-down'
    );
    expect(down.first().prop('disabled')).toBe(true);
  });

  it('reports a move with the id, the direction and the visible ids', () => {
    const onMove = jest.fn();
    moveButtons(render({ onMove }), 1)
      .filterWhere((node) => node.prop('data-testid') === 'move-up')
      .first()
      .simulate('click');

    expect(onMove).toHaveBeenCalledWith('b1', -1, ['b3', 'b1', 'b2']);
  });

  it('offers a jump to My Boards', () => {
    const onGoToMyBoards = jest.fn();
    const wrapper = render({ onGoToMyBoards });
    wrapper
      .find('button')
      .filterWhere((node) => node.prop('data-testid') === 'go-to-my-boards')
      .first()
      .simulate('click');
    expect(onGoToMyBoards).toHaveBeenCalled();
  });
});
