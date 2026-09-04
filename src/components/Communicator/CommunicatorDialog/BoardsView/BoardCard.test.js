import React from 'react';
import { mount } from 'enzyme';
import CardActionArea from '@material-ui/core/CardActionArea';
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import BoardCard from './BoardCard';

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
  lastEdited: '2026-01-01T00:00:00.000Z'
};

const render = (props = {}) =>
  mount(
    <BoardCard
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

describe('BoardCard', () => {
  it('calls onSelect when activated', () => {
    const onSelect = jest.fn();
    render({ onSelect }).find(CardActionArea).first().simulate('click');
    expect(onSelect).toHaveBeenCalledWith('b2');
  });

  it('marks the selected card with aria-current', () => {
    expect(
      render({ selected: true })
        .find(CardActionArea)
        .first()
        .prop('aria-current')
    ).toBe(true);
  });

  it('leaves aria-current off unselected cards', () => {
    expect(
      render().find(CardActionArea).first().prop('aria-current')
    ).toBeUndefined();
  });

  it('toggles quick access without selecting the board', () => {
    const onSelect = jest.fn();
    const onToggleQuickAccess = jest.fn();
    const stopPropagation = jest.fn();

    render({ onSelect, onToggleQuickAccess })
      .find(IconButton)
      .filterWhere((node) => node.prop('data-testid') === 'quick-access-toggle')
      .first()
      .simulate('click', { stopPropagation });

    expect(onToggleQuickAccess).toHaveBeenCalledWith(board);
  });

  it('labels the toggle Add when the board is not in quick access', () => {
    const toggle = render()
      .find(IconButton)
      .filterWhere((node) => node.prop('data-testid') === 'quick-access-toggle')
      .first();
    expect(toggle.prop('aria-label')).toBe('addToQuickAccess');
  });

  it('marks members with a filled star and a pressed toggle, not colour alone', () => {
    const toggle = render({
      communicator: { rootBoard: 'zzz', boards: ['b2'] }
    })
      .find(IconButton)
      .filterWhere((node) => node.prop('data-testid') === 'quick-access-toggle')
      .first();
    expect(toggle.prop('aria-pressed')).toBe(true);
    expect(toggle.prop('aria-label')).toBe('removeFromQuickAccess');
    expect(toggle.find(StarIcon)).toHaveLength(1);
    expect(toggle.find(StarBorderIcon)).toHaveLength(0);
  });

  it('renders no overflow action menu', () => {
    expect(render().find('button[aria-haspopup="true"]')).toHaveLength(0);
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
