import {
  UPDATE_PRODUCT_STATE,
  UPDATE_SUBSCRIBER_ID,
  UPDATE_IS_SUBSCRIBED,
  UPDATE_SUBSCRIPTION
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
