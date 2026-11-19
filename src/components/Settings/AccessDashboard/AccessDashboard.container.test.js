import React from 'react';
import { shallow } from 'enzyme';
import { Redirect } from 'react-router-dom';

import { AccessDashboardContainer } from './AccessDashboard.container';
import AccessDashboard from './AccessDashboard.component';
import API from '../../../api';
import { downloadQrCode, printQrCode } from './qrCodeActions';
import { isAndroid } from '../../../cordova-util';

jest.mock('react-intl', () => ({
  ...jest.requireActual('../../../__mocks__/react-intl'),
  defineMessages: (messages) => messages
}));

jest.mock('../../../api', () => ({
  getMyAccessClients: jest.fn(() => Promise.resolve({ data: [] }))
}));

jest.mock('./qrCodeActions', () => ({
  isPrintSupported: jest.fn(() => true),
  printQrCode: jest.fn(() => Promise.resolve()),
  downloadQrCode: jest.fn(() => Promise.resolve(false))
}));

jest.mock('../../../cordova-util', () => ({
  ...jest.requireActual('../../../cordova-util'),
  isAndroid: jest.fn(() => false)
}));

const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };
const client = { slug: 'cafe', clientName: 'Café' };
const gate = { code: 'CAFE01', qrCodeUrl: 'https://cdn.test/qr.png' };

const render = (props = {}) =>
  shallow(
    <AccessDashboardContainer
      intl={intl}
      history={{ push: jest.fn(), goBack: jest.fn() }}
      isLogged
      isAccessClient
      showNotification={jest.fn()}
      {...props}
    />
  );

const flush = () => new Promise((resolve) => setTimeout(resolve));

describe('AccessDashboardContainer', () => {
  afterEach(() => {
    jest.clearAllMocks();
    delete window.cordova;
  });

  it('loads the clients of an access client', () => {
    const wrapper = render();
    expect(wrapper.find(AccessDashboard)).toHaveLength(1);
    expect(API.getMyAccessClients).toHaveBeenCalled();
  });

  it('redirects a logged-out user to login without fetching', () => {
    const wrapper = render({ isLogged: false, isAccessClient: false });
    expect(wrapper.find(Redirect).prop('to')).toBe('/login-signup');
    expect(API.getMyAccessClients).not.toHaveBeenCalled();
  });

  it('redirects a user who is not an access client to settings', () => {
    const wrapper = render({ isAccessClient: false });
    expect(wrapper.find(Redirect).prop('to')).toBe('/settings');
    expect(API.getMyAccessClients).not.toHaveBeenCalled();
  });

  describe('copy link', () => {
    it('uses the browser clipboard on the web', async () => {
      const writeText = jest.fn(() => Promise.resolve());
      Object.assign(navigator, { clipboard: { writeText } });
      const showNotification = jest.fn();

      await render({ showNotification }).instance().handleCopyLink('url');

      expect(writeText).toHaveBeenCalledWith('url');
      expect(showNotification).toHaveBeenCalledWith('Link copied');
    });

    it('uses the Cordova clipboard plugin on Android', async () => {
      isAndroid.mockReturnValue(true);
      const copy = jest.fn(() => Promise.resolve());
      window.cordova = { plugins: { clipboard: { copy } } };

      await render().instance().handleCopyLink('url');

      expect(copy).toHaveBeenCalledWith('url');
      isAndroid.mockReturnValue(false);
    });
  });

  describe('QR actions', () => {
    it('notifies when printing fails', async () => {
      printQrCode.mockRejectedValueOnce(new Error('x'));
      const showNotification = jest.fn();

      await render({ showNotification }).instance().handlePrintQr(client, gate);

      expect(printQrCode).toHaveBeenCalledWith(gate.qrCodeUrl, 'Café');
      expect(showNotification).toHaveBeenCalledWith(
        'Could not load the QR code to print',
        'error'
      );
    });

    it('confirms when the QR code is saved on the device', async () => {
      downloadQrCode.mockResolvedValueOnce(true);
      const showNotification = jest.fn();

      await render({ showNotification })
        .instance()
        .handleDownloadQr(client, gate);

      expect(downloadQrCode).toHaveBeenCalledWith(
        gate.qrCodeUrl,
        'cafe-CAFE01.png'
      );
      expect(showNotification).toHaveBeenCalledWith(
        'QR code saved to Downloads'
      );
    });

    it('stays silent when the browser handles the download', async () => {
      const showNotification = jest.fn();
      await render({ showNotification })
        .instance()
        .handleDownloadQr(client, gate);
      await flush();
      expect(showNotification).not.toHaveBeenCalled();
    });

    it('notifies when the QR code cannot be saved', async () => {
      downloadQrCode.mockRejectedValueOnce(new Error('x'));
      const showNotification = jest.fn();

      await render({ showNotification })
        .instance()
        .handleDownloadQr(client, gate);

      expect(showNotification).toHaveBeenCalledWith(
        'Could not save the QR code',
        'error'
      );
    });
  });
});
