import {
  UPDATE_IS_IN_FREE_COUNTRY,
  UPDATE_IS_ON_TRIAL_PERIOD,
  UPDATE_ANDROID_SUBSCRIPTION_STATE,
  UPDATE_SUBSCRIBER_ID,
  UPDATE_IS_SUBSCRIBED,
  UPDATE_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION_ERROR,
  SHOW_PREMIUM_REQUIRED,
  HIDE_PREMIUM_REQUIRED,
  IN_GRACE_PERIOD,
  NOT_SUBSCRIBED,
  CANCELED,
  ACTIVE,
  REQUIRING_PREMIUM_COUNTRIES
} from './SubscriptionProvider.constants';

import { isLogged } from '../../components/App/App.selectors';

export function updateIsInFreeCountry() {
  return (dispatch, getState) => {
    const state = getState();
    const locationCode = isLogged(state)
      ? state.app.userData?.location?.countryCode
      : state.app.unloggedUserLocation?.countryCode;
    console.log(locationCode);
    const isInFreeCountry = !REQUIRING_PREMIUM_COUNTRIES.includes(locationCode);
    console.log(isInFreeCountry);
    dispatch({
      type: UPDATE_IS_IN_FREE_COUNTRY,
      isInFreeCountry
    });
  };
}

export function updateIsOnTrialPeriod() {
  return (dispatch, getState) => {
    const userCreatedAt = getState().app.userData.createdAt;
    const { isSubscribed } = getState().subscription;
    const isOnTrialPeriod = isUserOnTrialPeriod(userCreatedAt);
    dispatch({
      type: UPDATE_IS_ON_TRIAL_PERIOD,
      isOnTrialPeriod
    });

    if (!isOnTrialPeriod && !isSubscribed)
      dispatch(showPremiumRequired({ showTryPeriodFinishedMessages: true }));

    function isUserOnTrialPeriod(createdAt) {
      if (!createdAt) return false; //this case are already created users
      const createdAtDate = new Date(createdAt);
      const actualDate = new Date();
      const DAYS_TO_TRY = 30;
      const tryLimitDate = createdAtDate.setDate(
        createdAtDate.getDate() + DAYS_TO_TRY
      );
      if (actualDate >= tryLimitDate) return false;
      return true;
    }
  };
}

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

export function showPremiumRequired(
  { showTryPeriodFinishedMessages } = { showTryPeriodFinishedMessages: false }
) {
  return {
    type: SHOW_PREMIUM_REQUIRED,
    showTryPeriodFinishedMessages
  };
}

export function hidePremiumRequired() {
  return {
    type: HIDE_PREMIUM_REQUIRED
  };
}
