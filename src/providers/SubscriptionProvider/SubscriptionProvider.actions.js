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
export function comprobeSubscription(payload) {
  return async (dispatch, getState) => {
    const { expiryDate, androidSubscriptionState } = getState().subscription;
    if (expiryDate) {
      const expiryDateFormat = new Date(expiryDate);
      const expiryDateMillis = expiryDateFormat.getTime();
      const nowInMillis = Date.now();
      const isExpired = nowInMillis > expiryDateMillis;

      const daysGracePeriod = 3;

      const billingRetryPeriodFinishDate =
        androidSubscriptionState === 'in_grace_period'
          ? expiryDateFormat
          : expiryDateFormat.setMinutes(
              expiryDateFormat.getMinutes() + daysGracePeriod
            );

      if (isExpired) {
        window.CdvPurchase.store.update();

        const isBillingRetryPeriodFinished = () => {
          console.log(
            'billingRetryPeriodFinishDate ',
            billingRetryPeriodFinishDate
          );
          console.log(
            'Is billing retry period finished: , ',
            nowInMillis > billingRetryPeriodFinishDate
          );
          return nowInMillis > billingRetryPeriodFinishDate;
        };

        if (
          androidSubscriptionState === 'canceled' ||
          isBillingRetryPeriodFinished()
        ) {
          dispatch(
            updateSubscription({
              isSubscribed: false,
              expiryDate: null,
              androidSubscriptionState: 'not_subscribed'
            })
          );
          return;
        }
        dispatch(
          updateSubscription({
            isSubscribed: true,
            expiryDate: billingRetryPeriodFinishDate,
            androidSubscriptionState: 'in_grace_period'
          })
        );
      }
    }
  };
}
