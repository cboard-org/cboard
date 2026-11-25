import React from 'react';
import { mount } from 'enzyme';
import Drawer from '@material-ui/core/Drawer';
import ItemDetailsSurface from './ItemDetailsSurface';
import ItemDetails from './ItemDetails';

jest.mock('./Dashboard.messages', () => ({
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

jest.mock('./ItemThumb', () => ({
  __esModule: true,
  default: () => null
}));

const setViewport = (matches) => {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches,
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  }));
};

const item = {
  selectedKey: 'b1',
  title: 'Comidas',
  meta: ['01/01/2026']
};

let plainWrappers = [];
let attachedWrappers = [];
let attachedNodes = [];

const element = (props) => (
  <ItemDetailsSurface
    label="Details"
    emptyMessage="Select an item"
    {...item}
    actions={[]}
    busy={false}
    onClose={jest.fn()}
    {...props}
  />
);

const render = (props = {}) => {
  const wrapper = mount(element(props));
  plainWrappers.push(wrapper);
  return wrapper;
};

const renderAttached = (props = {}) => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  attachedNodes.push(host);
  const wrapper = mount(element(props), { attachTo: host });
  attachedWrappers.push(wrapper);
  return wrapper;
};

const appendOutsideButton = () => {
  const outside = document.createElement('button');
  document.body.appendChild(outside);
  attachedNodes.push(outside);
  return outside;
};

describe('ItemDetailsSurface', () => {
  afterEach(() => {
    plainWrappers.forEach((wrapper) => {
      if (wrapper.length) {
        wrapper.unmount();
      }
    });
    plainWrappers = [];
    attachedWrappers.forEach((wrapper) => {
      if (wrapper.length) {
        wrapper.detach();
      }
    });
    attachedWrappers = [];
    attachedNodes.forEach((node) => {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });
    attachedNodes = [];
    delete window.matchMedia;
  });

  it('renders an inline panel on wide viewports', () => {
    setViewport(false);
    const wrapper = render();
    expect(wrapper.find(Drawer)).toHaveLength(0);
    expect(wrapper.find(ItemDetails)).toHaveLength(1);
  });

  it('titles the panel with the label when nothing is selected', () => {
    setViewport(false);
    const wrapper = render({ selectedKey: null });
    expect(wrapper.find('h2').first().text()).toBe('Details');
    expect(wrapper.text()).toContain('Select an item');
  });

  it('renders a bottom drawer on narrow viewports', () => {
    setViewport(true);
    const wrapper = render();
    const drawer = wrapper.find(Drawer);
    expect(drawer).toHaveLength(1);
    expect(drawer.prop('anchor')).toBe('bottom');
  });

  it('opens the drawer only when an item is selected', () => {
    setViewport(true);
    expect(render({ selectedKey: null }).find(Drawer).prop('open')).toBe(false);
    expect(render().find(Drawer).prop('open')).toBe(true);
  });

  it('closes the drawer from the close button', () => {
    setViewport(true);
    const onClose = jest.fn();
    const wrapper = render({ onClose });

    wrapper.find('button[data-testid="close-item-details"]').simulate('click');

    expect(onClose).toHaveBeenCalled();
  });

  it('closes on Escape', () => {
    setViewport(false);
    const onClose = jest.fn();
    const wrapper = render({ onClose });

    wrapper
      .find('[data-testid="item-details-panel"]')
      .first()
      .simulate('keydown', {
        key: 'Escape'
      });

    expect(onClose).toHaveBeenCalled();
  });

  it('does not re-take focus when the selected item data changes', () => {
    setViewport(false);
    const outside = appendOutsideButton();
    const wrapper = renderAttached();

    outside.focus();
    wrapper.setProps({ meta: ['02/01/2026'] });

    expect(document.activeElement).toBe(outside);
  });

  it('moves focus into the details when a different item is selected', () => {
    setViewport(false);
    const outside = appendOutsideButton();
    const wrapper = renderAttached();

    outside.focus();
    wrapper.setProps({ selectedKey: 'b2', title: 'Escuela' });

    expect(document.activeElement.tagName).toBe('H2');
  });
});
