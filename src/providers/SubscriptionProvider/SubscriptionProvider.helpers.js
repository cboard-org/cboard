import {
  ACTIVE,
  CANCELED,
  EXPIRED,
  IN_GRACE_PERIOD,
  NOT_SUBSCRIBED,
  ON_HOLD,
  PAUSED,
  PROCCESING,
  SUSPENDED,
  UNVERIFIED
} from './SubscriptionProvider.constants';

// Maps status aliases (e.g. from older DB documents or PayPal vocabulary
// that slipped through without normalization) to canonical constants.
const STATUS_ALIASES = {
  cancelled: CANCELED
};

const KNOWN_STATUSES = [
  ACTIVE,
  CANCELED,
  EXPIRED,
  IN_GRACE_PERIOD,
  NOT_SUBSCRIBED,
  ON_HOLD,
  PAUSED,
  PROCCESING,
  SUSPENDED,
  UNVERIFIED
];

/**
 * Normalizes a subscription status string to a known constant.
 * Falls back to NOT_SUBSCRIBED for any unrecognized value so the user
 * is never locked out of purchasing.
 */
export const normalizeStatus = status => {
  const lowered = typeof status === 'string' ? status.toLowerCase() : '';
  const aliased = STATUS_ALIASES[lowered] || lowered;
  return KNOWN_STATUSES.includes(aliased) ? aliased : NOT_SUBSCRIBED;
};
