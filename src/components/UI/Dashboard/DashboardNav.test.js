import React from 'react';
import { mount } from 'enzyme';
import ListItem from '@material-ui/core/ListItem';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import CropFreeIcon from '@material-ui/icons/CropFree';
import CardMembershipIcon from '@material-ui/icons/CardMembership';
import DashboardNav from './DashboardNav';

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

const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };

const sections = [
  {
    key: 'qrCodes',
    label: 'QR codes',
    hint: 'Print, download, share',
    icon: CropFreeIcon
  },
  {
    key: 'plan',
    label: 'Plan',
    hint: 'Your subscription',
    icon: CardMembershipIcon
  }
];

const STORAGE_KEY = 'test-nav-collapsed';

const render = (props = {}) =>
  mount(
    <DashboardNav
      intl={intl}
      sections={sections}
      section="qrCodes"
      onChange={jest.fn()}
      idPrefix="AccessDashboard"
      {...props}
    />
  );

// The permanent and the temporary drawer both render (CSS decides which one
// shows), so the docked one is the first.
const dockedItems = (wrapper) => wrapper.find(Drawer).first().find(ListItem);

describe('DashboardNav', () => {
  afterEach(() => {
    window.localStorage.removeItem(STORAGE_KEY);
  });

  it('renders one item per section with its label and hint', () => {
    const items = dockedItems(render());
    expect(items).toHaveLength(2);
    expect(items.first().text()).toContain('QR codes');
    expect(items.first().text()).toContain('Print, download, share');
    expect(items.last().text()).toContain('Plan');
  });

  it('prefixes the item ids so tours can target them', () => {
    const wrapper = render();
    expect(
      wrapper
        .find(Drawer)
        .first()
        .find('#AccessDashboard__nav-plan')
        .hostNodes()
    ).toHaveLength(1);
    expect(wrapper.find('#AccessDashboard__nav-list').hostNodes()).toHaveLength(
      1
    );
  });

  it('marks the current section with aria-current', () => {
    const items = dockedItems(render());
    expect(items.first().prop('aria-current')).toBe('page');
    expect(items.last().prop('aria-current')).toBeUndefined();
  });

  it('calls onChange with the section key', () => {
    const onChange = jest.fn();
    dockedItems(render({ onChange })).last().simulate('click');
    expect(onChange).toHaveBeenCalledWith('plan');
  });

  it('closes the mobile drawer after choosing a section', () => {
    const onChange = jest.fn();
    const onMobileClose = jest.fn();
    render({ onChange, onMobileClose, mobileOpen: true })
      .find(Drawer)
      .last()
      .find(ListItem)
      .last()
      .simulate('click');
    expect(onChange).toHaveBeenCalledWith('plan');
    expect(onMobileClose).toHaveBeenCalled();
  });

  it('persists the collapsed state under the given storage key', () => {
    const wrapper = render({ collapsedStorageKey: STORAGE_KEY });
    const toggle = wrapper.find(IconButton).first();
    expect(toggle.prop('aria-label')).toBe('collapseNavigation');

    toggle.simulate('click');

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('true');
    expect(wrapper.find(IconButton).first().prop('aria-label')).toBe(
      'expandNavigation'
    );
  });

  it('restores the collapsed state from storage', () => {
    window.localStorage.setItem(STORAGE_KEY, 'true');
    const toggle = render({ collapsedStorageKey: STORAGE_KEY })
      .find(IconButton)
      .first();
    expect(toggle.prop('aria-expanded')).toBe(false);
  });

  it('does not touch storage without a storage key', () => {
    render().find(IconButton).first().simulate('click');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
