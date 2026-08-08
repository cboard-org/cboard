import React from 'react';
import { mount } from 'enzyme';
import Button from '@material-ui/core/Button';
import BoardDetails from './BoardDetails';

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
  id: 'b1',
  name: 'Comidas',
  tiles: [{ id: 't1' }, { id: 't2' }],
  lastEdited: '2026-01-01T00:00:00.000Z'
};

const actions = [
  { key: 'show', label: 'Show', icon: null, onClick: jest.fn() },
  {
    key: 'clone',
    label: 'Clone',
    icon: null,
    disabled: true,
    onClick: jest.fn()
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: null,
    destructive: true,
    onClick: jest.fn()
  }
];

const render = (props = {}) =>
  mount(
    <BoardDetails
      intl={intl}
      board={board}
      actions={actions}
      busy={false}
      onClose={jest.fn()}
      {...props}
    />
  );

describe('BoardDetails', () => {
  it('renders the board name', () => {
    expect(render().text()).toContain('Comidas');
  });

  it('renders one button per action with a visible label', () => {
    const buttons = render()
      .find(Button)
      .filterWhere(node => !!node.prop('data-action-key'));
    expect(buttons).toHaveLength(3);
    expect(buttons.map(node => node.text())).toEqual(
      expect.arrayContaining(['Show', 'Clone', 'Delete'])
    );
  });

  it('disables an action marked disabled', () => {
    const clone = render()
      .find(Button)
      .filterWhere(node => node.prop('data-action-key') === 'clone');
    expect(clone.prop('disabled')).toBe(true);
  });

  it('disables every action while busy', () => {
    const show = render({ busy: true })
      .find(Button)
      .filterWhere(node => node.prop('data-action-key') === 'show');
    expect(show.prop('disabled')).toBe(true);
  });

  it('calls the action handler on click', () => {
    const onClick = jest.fn();
    const wrapper = render({
      actions: [{ key: 'show', label: 'Show', icon: null, onClick }]
    });

    wrapper
      .find(Button)
      .filterWhere(node => node.prop('data-action-key') === 'show')
      .simulate('click');

    expect(onClick).toHaveBeenCalled();
  });

  it('renders a prompt when nothing is selected', () => {
    expect(render({ board: null }).text()).toContain('selectBoardPrompt');
  });
});
