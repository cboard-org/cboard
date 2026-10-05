import React from 'react';
import { mount } from 'enzyme';
import ButtonBase from '@material-ui/core/ButtonBase';
import BoardRow from './BoardRow';

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

const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };

const board = {
  id: 'b2',
  name: 'Comidas',
  tiles: [],
  author: 'Tester',
  lastEdited: '2026-01-01T00:00:00.000Z'
};

const render = (props = {}) =>
  mount(
    <BoardRow
      intl={intl}
      board={board}
      communicator={{ rootBoard: 'b1', boards: ['b1'] }}
      activeBoardId="b1"
      selected={false}
      busy={false}
      onSelect={jest.fn()}
      onToggleQuickAccess={jest.fn()}
      registerTrigger={jest.fn()}
      {...props}
    />
  );

describe('BoardRow', () => {
  it('calls onSelect when activated', () => {
    const onSelect = jest.fn();
    render({ onSelect }).find(ButtonBase).first().simulate('click');
    expect(onSelect).toHaveBeenCalledWith('b2');
  });

  it('toggles quick access without selecting the row', () => {
    const onSelect = jest.fn();
    const onToggleQuickAccess = jest.fn();
    render({ onSelect, onToggleQuickAccess })
      .find('button[data-testid="quick-access-toggle"]')
      .first()
      .simulate('click');
    expect(onToggleQuickAccess).toHaveBeenCalledWith(board);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('disables the quick access star on the root board', () => {
    const wrapper = render({
      communicator: { rootBoard: 'b2', boards: ['b2'] }
    });
    expect(
      wrapper
        .find('[data-testid="quick-access-toggle"]')
        .first()
        .prop('disabled')
    ).toBe(true);
  });
});
