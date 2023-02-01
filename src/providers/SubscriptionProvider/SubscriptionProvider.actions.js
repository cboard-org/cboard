import {
  UPDATE_PRODUCT_STATE,
  UPDATE_SUBSCRIBER_ID,
  UPDATE_IS_SUBSCRIBED,
  UPDATE_SUBSCRIPTION,
  SHOW_PREMIUM_REQUIRED,
  HIDE_PREMIUM_REQUIRED
} from './SubscriptionProvider.constants';

export function updateProductState(payload = {}) {
  return {
    type: UPDATE_PRODUCT_STATE,
    payload
  };
}
export function updateSubscriberId(payload = {}) {
  return {
    type: UPDATE_SUBSCRIBER_ID,
    payload
  };
}
export function updateIsSubscribed(payload) {
  return {
    type: UPDATE_IS_SUBSCRIBED,
    payload
  };
}
export function updateSubscription(payload) {
  return {
    type: UPDATE_SUBSCRIPTION,
    payload
  };
}

export function showPremiumRequired(
  { isTryPeriodFinished } = { isTryPeriodFinished: false }
) {
  return {
    type: SHOW_PREMIUM_REQUIRED,
    isTryPeriodFinished
  };
}

export function hidePremiumRequired() {
  return {
    type: HIDE_PREMIUM_REQUIRED
  };
}
