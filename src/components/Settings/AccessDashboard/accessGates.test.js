import {
  isClientPaused,
  getGateItems,
  getAccessPath,
  getAccessUrl
} from './accessGates';
import { isCordova } from '../../../cordova-util';

jest.mock('../../../cordova-util', () => ({
  ...jest.requireActual('../../../cordova-util'),
  isCordova: jest.fn(() => false)
}));

const client = {
  slug: 'cafe-don-pedro',
  isActive: true,
  isExpired: false,
  accessGates: [{ code: 'CAFE01' }, { code: 'CAFE02' }]
};

describe('accessGates', () => {
  it('pauses a client that is inactive or expired', () => {
    expect(isClientPaused(client)).toBe(false);
    expect(isClientPaused({ ...client, isActive: false })).toBe(true);
    expect(isClientPaused({ ...client, isExpired: true })).toBe(true);
  });

  it('flattens the clients into one item per gate', () => {
    const other = { slug: 'kiosco', accessGates: [{ code: 'KIOS01' }] };
    const items = getGateItems([client, other, { slug: 'empty' }]);

    expect(items.map((item) => item.key)).toEqual([
      'cafe-don-pedro/CAFE01',
      'cafe-don-pedro/CAFE02',
      'kiosco/KIOS01'
    ]);
    expect(items[2].client).toBe(other);
    expect(items[2].gate).toBe(other.accessGates[0]);
  });

  it('builds the public access path', () => {
    expect(getAccessPath(client, client.accessGates[0])).toBe(
      '/access/cafe-don-pedro/CAFE01'
    );
  });

  it('builds the access URL from the current origin on the web', () => {
    expect(getAccessUrl(client, client.accessGates[0])).toBe(
      `${window.location.origin}/access/cafe-don-pedro/CAFE01`
    );
  });

  it('builds the access URL from the public app URL on Cordova', () => {
    isCordova.mockReturnValueOnce(true);
    expect(getAccessUrl(client, client.accessGates[0])).toBe(
      'https://app.cboard.io/access/cafe-don-pedro/CAFE01'
    );
  });
});
