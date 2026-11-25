import React from 'react';
import { mount } from 'enzyme';
import CardActionArea from '@material-ui/core/CardActionArea';
import IconButton from '@material-ui/core/IconButton';
import ItemCard from './ItemCard';

jest.mock('./ItemThumb', () => ({
  __esModule: true,
  default: () => null
}));

const render = (props = {}) =>
  mount(
    <ItemCard
      title="Comidas"
      meta={['12 Tiles', 'English']}
      caption="01/01/2026"
      onSelect={jest.fn()}
      {...props}
    />
  );

describe('ItemCard', () => {
  it('renders the title, meta and caption', () => {
    const text = render().text();
    expect(text).toContain('Comidas');
    expect(text).toContain('12 Tiles  ·  English');
    expect(text).toContain('01/01/2026');
  });

  it('calls onSelect when activated', () => {
    const onSelect = jest.fn();
    render({ onSelect }).find(CardActionArea).first().simulate('click');
    expect(onSelect).toHaveBeenCalled();
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

  it('hands the activation button to buttonRef', () => {
    const buttonRef = jest.fn();
    render({ buttonRef });
    expect(buttonRef).toHaveBeenCalledWith(expect.any(HTMLElement));
  });

  it('renders the footer action outside the activation area', () => {
    const onSelect = jest.fn();
    const onAction = jest.fn();
    const wrapper = render({
      onSelect,
      action: (
        <IconButton data-testid="item-action" onClick={onAction}>
          ★
        </IconButton>
      )
    });

    expect(
      wrapper.find(CardActionArea).find('[data-testid="item-action"]')
    ).toHaveLength(0);
    wrapper.find('button[data-testid="item-action"]').simulate('click');
    expect(onAction).toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('omits the footer when there is no status or action', () => {
    expect(render().find('[data-testid="item-action"]')).toHaveLength(0);
    expect(render({ status: <span>Root</span> }).text()).toContain('Root');
  });

  it('shows a progress indicator while busy', () => {
    expect(
      render({ busy: true }).find('[role="progressbar"]')
    ).not.toHaveLength(0);
  });
});
