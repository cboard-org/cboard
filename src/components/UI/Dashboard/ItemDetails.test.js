import React from 'react';
import { mount } from 'enzyme';
import Button from '@material-ui/core/Button';
import ItemDetails from './ItemDetails';

jest.mock('./ItemThumb', () => ({
  __esModule: true,
  default: () => null
}));

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
    <ItemDetails
      title="Comidas"
      meta={['2 Tiles', '01/01/2026']}
      actions={actions}
      busy={false}
      emptyMessage="Select an item"
      {...props}
    />
  );

describe('ItemDetails', () => {
  it('renders the title and meta', () => {
    const text = render().text();
    expect(text).toContain('Comidas');
    expect(text).toContain('2 Tiles');
    expect(text).toContain('01/01/2026');
  });

  it('hides the title when asked to', () => {
    expect(render({ hideTitle: true }).find('h2')).toHaveLength(0);
  });

  it('renders the chips slot', () => {
    expect(render({ chips: <span>Root</span> }).text()).toContain('Root');
  });

  it('renders one button per action with a visible label', () => {
    const buttons = render()
      .find(Button)
      .filterWhere((node) => !!node.prop('data-action-key'));
    expect(buttons).toHaveLength(3);
    expect(buttons.map((node) => node.text())).toEqual(
      expect.arrayContaining(['Show', 'Clone', 'Delete'])
    );
  });

  it('disables an action marked disabled', () => {
    const clone = render()
      .find(Button)
      .filterWhere((node) => node.prop('data-action-key') === 'clone');
    expect(clone.prop('disabled')).toBe(true);
  });

  it('disables every action while busy', () => {
    const show = render({ busy: true })
      .find(Button)
      .filterWhere((node) => node.prop('data-action-key') === 'show');
    expect(show.prop('disabled')).toBe(true);
  });

  it('calls the action handler on click', () => {
    const onClick = jest.fn();
    const wrapper = render({
      actions: [{ key: 'show', label: 'Show', icon: null, onClick }]
    });

    wrapper
      .find(Button)
      .filterWhere((node) => node.prop('data-action-key') === 'show')
      .simulate('click');

    expect(onClick).toHaveBeenCalled();
  });

  it('renders the empty message when nothing is selected', () => {
    expect(render({ empty: true }).text()).toBe('Select an item');
  });
});
