import {
  UPDATE_ANDROID_SUBSCRIPTION_STATE,
  UPDATE_SUBSCRIBER_ID,
  UPDATE_IS_SUBSCRIBED,
  UPDATE_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION_ERROR,
  IN_GRACE_PERIOD,
  NOT_SUBSCRIBED,
  CANCELED,
  ACTIVE
} from './SubscriptionProvider.constants';

export function updateAndroidSubscriptionState(payload = {}) {
  return {
    type: UPDATE_ANDROID_SUBSCRIPTION_STATE,
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
export function updateSubscriptionError(payload) {
  return {
    type: UPDATE_SUBSCRIPTION_ERROR,
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

      // Change to 14 days before merge in production
      const daysGracePeriod = 3;

      const billingRetryPeriodFinishDate =
        androidSubscriptionState === ACTIVE
          ? expiryDateFormat.setMinutes(
              //Change to expiryDateFormat.setDate before merge in production
              expiryDateFormat.getMinutes() + daysGracePeriod //Change to expiryDateFormat.getDate() before merge in production
            )
          : expiryDateFormat;

      if (isExpired) {
        window.CdvPurchase.store.restorePurchases();

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
          androidSubscriptionState === CANCELED ||
          isBillingRetryPeriodFinished()
        ) {
          dispatch(
            updateSubscription({
              isSubscribed: false,
              expiryDate: null,
              androidSubscriptionState: NOT_SUBSCRIBED
            })
          );
          return;
        }
        dispatch(
          updateSubscription({
            isSubscribed: true,
            expiryDate: billingRetryPeriodFinishDate,
            androidSubscriptionState: IN_GRACE_PERIOD
          })
        );
      }
    }
  };
}
