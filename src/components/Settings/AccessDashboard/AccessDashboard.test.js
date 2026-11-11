import React from 'react';
import { mount } from 'enzyme';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';

import AccessDashboard from './AccessDashboard.component';
import { ItemCard, ItemDetailsSurface } from '../../UI/Dashboard';
import ClientStatusChip from './ClientStatusChip';
import { printQrCode, downloadQrCode } from './qrCodeActions';

jest.mock('react-intl', () => ({
  ...jest.requireActual('../../../__mocks__/react-intl'),
  defineMessages: (messages) => messages
}));

jest.mock('./qrCodeActions', () => ({
  printQrCode: jest.fn(),
  downloadQrCode: jest.fn()
}));

jest.mock('../../UI/Dashboard/ItemThumb', () => ({
  __esModule: true,
  default: () => null
}));

const intl = {
  formatMessage: ({ defaultMessage }, values = {}) =>
    Object.keys(values).reduce(
      (text, key) => text.replace(`{${key}}`, values[key]),
      defaultMessage
    ),
  formatDate: () => 'Jan 15, 2026',
  formatRelative: () => '2 hours ago'
};

const activeClient = {
  slug: 'cafe-don-pedro',
  clientName: 'Cafetería Don Pedro',
  isActive: true,
  isExpired: false,
  subscriptionEnd: '2026-12-31T00:00:00.000Z',
  accessGates: [
    {
      code: 'CAFE01',
      viewsCount: 128,
      lastAccessAt: '2026-11-04T10:00:00.000Z',
      qrCodeUrl: 'https://cdn.test/qr-codes/cafe-don-pedro-CAFE01.png',
      rootBoard: { id: 'b1', name: 'Menú Principal' }
    }
  ]
};

const expiredClient = {
  slug: 'kiosco-central',
  clientName: 'Kiosco Central',
  isActive: true,
  isExpired: true,
  subscriptionEnd: '2026-01-15T00:00:00.000Z',
  accessGates: [
    {
      code: 'KIOS01',
      viewsCount: 0,
      lastAccessAt: null,
      qrCodeUrl: null,
      rootBoard: { id: 'b2', name: 'Productos' }
    }
  ]
};

let wrappers = [];

const render = (props = {}) => {
  const wrapper = mount(
    <AccessDashboard
      intl={intl}
      clients={[activeClient, expiredClient]}
      onRetry={jest.fn()}
      onClose={jest.fn()}
      onOpenBoard={jest.fn()}
      onCopyLink={jest.fn()}
      {...props}
    />
  );
  wrappers.push(wrapper);
  return wrapper;
};

const selectCard = (wrapper, index) => {
  wrapper.find(ItemCard).at(index).find('button').first().simulate('click');
  wrapper.update();
};

const clickAction = (wrapper, key) => {
  wrapper.find(`button[data-action-key="${key}"]`).simulate('click');
};

describe('AccessDashboard', () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }));
  });

  afterEach(() => {
    wrappers.forEach((wrapper) => wrapper.unmount());
    wrappers = [];
    delete window.matchMedia;
    jest.clearAllMocks();
  });

  it('shows a spinner while loading', () => {
    const wrapper = render({ clients: [], loading: true });
    expect(wrapper.find(CircularProgress)).toHaveLength(1);
    expect(wrapper.find(ItemCard)).toHaveLength(0);
  });

  it('offers a retry when loading fails', () => {
    const onRetry = jest.fn();
    const wrapper = render({ clients: [], error: new Error('x'), onRetry });

    wrapper.find(Alert).find('button').simulate('click');

    expect(onRetry).toHaveBeenCalled();
  });

  it('shows an empty state without locations', () => {
    const wrapper = render({ clients: [] });
    expect(wrapper.text()).toContain(
      'You have no Cboard Access locations yet.'
    );
  });

  it('renders one card per access gate', () => {
    const cards = render().find(ItemCard);

    expect(cards).toHaveLength(2);
    expect(cards.at(0).prop('title')).toBe('Cafetería Don Pedro');
    expect(cards.at(0).prop('meta')).toEqual(['CAFE01', 'Menú Principal']);
    expect(cards.at(0).prop('thumb').src).toBe(
      activeClient.accessGates[0].qrCodeUrl
    );
  });

  it('marks the gates of an expired client as paused', () => {
    const chips = render().find(ItemCard).find(ClientStatusChip);
    expect(chips.at(0).text()).toBe('Active');
    expect(chips.at(1).text()).toBe('Paused');
  });

  it('alerts about each expired subscription', () => {
    const alerts = render().find(Alert);
    expect(alerts).toHaveLength(1);
    expect(alerts.text()).toContain('Kiosco Central: subscription expired');
  });

  it('opens the details of the selected gate', () => {
    const wrapper = render();
    expect(wrapper.find(ItemDetailsSurface).prop('selectedKey')).toBeNull();

    selectCard(wrapper, 0);

    const surface = wrapper.find(ItemDetailsSurface);
    expect(surface.prop('selectedKey')).toBe('cafe-don-pedro/CAFE01');
    expect(surface.prop('meta')).toEqual(['CAFE01', 'Opens Menú Principal']);
    expect(surface.text()).toContain('Last scan 2 hours ago');
    expect(wrapper.find(ItemCard).at(0).prop('selected')).toBe(true);
  });

  it('prints and downloads the generated QR code', () => {
    const wrapper = render();
    selectCard(wrapper, 0);
    const { qrCodeUrl } = activeClient.accessGates[0];

    clickAction(wrapper, 'print');
    clickAction(wrapper, 'download');

    expect(printQrCode).toHaveBeenCalledWith(qrCodeUrl, 'Cafetería Don Pedro');
    expect(downloadQrCode).toHaveBeenCalledWith(
      qrCodeUrl,
      'cafe-don-pedro-CAFE01.png'
    );
  });

  it('disables print and download until the QR code is generated', () => {
    const wrapper = render();
    selectCard(wrapper, 1);

    expect(
      wrapper.find('button[data-action-key="print"]').prop('disabled')
    ).toBe(true);
    expect(
      wrapper.find('button[data-action-key="download"]').prop('disabled')
    ).toBe(true);
  });

  it('copies the access link and opens the board', () => {
    const onCopyLink = jest.fn();
    const onOpenBoard = jest.fn();
    const wrapper = render({ onCopyLink, onOpenBoard });
    selectCard(wrapper, 0);

    clickAction(wrapper, 'copyLink');
    clickAction(wrapper, 'openBoard');

    expect(onCopyLink).toHaveBeenCalledWith(
      `${window.location.origin}/access/cafe-don-pedro/CAFE01`
    );
    expect(onOpenBoard).toHaveBeenCalledWith(
      activeClient,
      activeClient.accessGates[0]
    );
  });

  it('lists the subscription status of each location in the Plan section', () => {
    const wrapper = render();

    wrapper
      .find('#AccessDashboard__nav-plan')
      .hostNodes()
      .first()
      .simulate('click');

    expect(wrapper.find(ItemCard)).toHaveLength(0);
    const chips = wrapper.find(ClientStatusChip);
    expect(chips.at(0).text()).toBe('Active');
    expect(chips.at(1).text()).toBe('Expired');
    expect(wrapper.text()).toContain('Valid until Jan 15, 2026');
    expect(wrapper.text()).toContain('Expired on Jan 15, 2026 · QR paused');
  });
});
