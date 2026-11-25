import React from 'react';
import { mount } from 'enzyme';
import Drawer from '@material-ui/core/Drawer';
import BoardDetailsSurface from './BoardDetailsSurface';
import ItemDetails from '../../../UI/Dashboard/ItemDetails';

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

jest.mock('../../../UI/Dashboard/Dashboard.messages', () => ({
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

jest.mock('../../../UI/Dashboard/ItemThumb', () => ({
  __esModule: true,
  default: () => null
}));

const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };

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

const board = {
  id: 'b1',
  name: 'Comidas',
  tiles: [],
  lastEdited: '2026-01-01T00:00:00.000Z'
};

let plainWrappers = [];
let attachedWrappers = [];
let attachedNodes = [];

const render = (props = {}) => {
  const wrapper = mount(
    <BoardDetailsSurface
      intl={intl}
      board={board}
      actions={[]}
      busy={false}
      onClose={jest.fn()}
      {...props}
    />
  );
  plainWrappers.push(wrapper);
  return wrapper;
};

const renderAttached = (props = {}) => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  attachedNodes.push(host);
  const wrapper = mount(
    <BoardDetailsSurface
      intl={intl}
      board={board}
      actions={[]}
      busy={false}
      onClose={jest.fn()}
      {...props}
    />,
    { attachTo: host }
  );
  attachedWrappers.push(wrapper);
  return wrapper;
};

const appendOutsideButton = () => {
  const outside = document.createElement('button');
  document.body.appendChild(outside);
  attachedNodes.push(outside);
  return outside;
};

describe('BoardDetailsSurface', () => {
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

  it('renders a bottom drawer on narrow viewports', () => {
    setViewport(true);
    const wrapper = render();
    const drawer = wrapper.find(Drawer);
    expect(drawer).toHaveLength(1);
    expect(drawer.prop('anchor')).toBe('bottom');
  });

  it('renders a prompt when nothing is selected', () => {
    setViewport(false);
    expect(render({ board: null }).text()).toContain('selectBoardPrompt');
  });

  it('renders the board name and its metadata', () => {
    setViewport(false);
    const text = render().text();
    expect(text).toContain('Comidas');
    expect(text).toContain('tilesQty');
  });

  it('opens the drawer only when a board is selected', () => {
    setViewport(true);
    expect(render({ board: null }).find(Drawer).prop('open')).toBe(false);
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

  it('does not re-take focus when the selected board object is replaced', () => {
    setViewport(false);
    const outside = appendOutsideButton();
    const wrapper = renderAttached();

    outside.focus();
    wrapper.setProps({ board: { ...board, isPublic: true } });

    expect(document.activeElement).toBe(outside);
  });

  it('moves focus into the details when a different board is selected', () => {
    setViewport(false);
    const outside = appendOutsideButton();
    const wrapper = renderAttached();

    outside.focus();
    wrapper.setProps({ board: { ...board, id: 'b2', name: 'Escuela' } });

    expect(document.activeElement.tagName).toBe('H2');
  });
});
