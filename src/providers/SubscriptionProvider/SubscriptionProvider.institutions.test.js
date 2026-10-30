import {
  hasCurrentSubscription,
  normalizeStatus
} from './SubscriptionProvider.helpers';
test('ordinary subscriptions keep their established access semantics', () => {
  expect(
    hasCurrentSubscription({
      isSubscribed: true,
      ownedProduct: { platform: 'paypal' }
    })
  ).toBe(true);
  expect(normalizeStatus('cancelled')).toBe('canceled');
});
test('institutional cached access expires without an extra grace week', () => {
  const now = Date.parse('2026-10-30T12:00:00Z');
  expect(
    hasCurrentSubscription(
      {
        isSubscribed: true,
        ownedProduct: { platform: 'institutional' },
        expiryDate: '2026-10-30T12:00:00Z'
      },
      now
    )
  ).toBe(false);
  expect(
    hasCurrentSubscription(
      {
        isSubscribed: true,
        ownedProduct: { platform: 'institutional' },
        expiryDate: '2026-10-30T12:00:01Z'
      },
      now
    )
  ).toBe(true);
});
