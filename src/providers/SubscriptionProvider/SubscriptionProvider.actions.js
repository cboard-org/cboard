import {
  UPDATE_ANDROID_SUBSCRIPTION_STATE,
  UPDATE_SUBSCRIBER_ID,
  UPDATE_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION_ERROR,
  SHOW_PREMIUM_REQUIRED,
  HIDE_PREMIUM_REQUIRED,
  IN_GRACE_PERIOD,
  NOT_SUBSCRIBED,
  CANCELED,
  ACTIVE,
  REQUIRING_PREMIUM_COUNTRIES,
  UPDATE_PRODUCT
} from './SubscriptionProvider.constants';
import API from '../../api';
import { isLogged } from '../../components/App/App.selectors';

export function updateIsInFreeCountry() {
  return (dispatch, getState) => {
    const state = getState();
    const locationCode = isLogged(state)
      ? state.app.userData?.location?.countryCode
      : state.app.unloggedUserLocation?.countryCode;
    const isInFreeCountry = !REQUIRING_PREMIUM_COUNTRIES.includes(locationCode);
    dispatch(
      updateSubscription({
        isInFreeCountry
      })
    );
    return isInFreeCountry;
  };
}

export function updateIsOnTrialPeriod() {
  return (dispatch, getState) => {
    const state = getState();
    const userCreatedAt = state.app.userData.createdAt;
    const isOnTrialPeriod = isUserOnTrialPeriod(userCreatedAt);
    dispatch(
      updateSubscription({
        isOnTrialPeriod
      })
    );
    return isOnTrialPeriod;

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

export function updateIsSubscribed() {
  return async (dispatch, getState) => {
    let isSubscribed = false;
    try {
      const state = getState();
      if (!isLogged(state)) {
        dispatch(
          updateSubscription({
            isSubscribed
          })
        );
      } else {
        const userId = state.app.userData.id;
        const { status } = await API.getSubscriber(userId);
        isSubscribed =
          status.toLowerCase() === ('active' || 'canceled') ? true : false;
        dispatch(
          updateSubscription({
            androidSubscriptionState: status.toLowerCase(),
            isSubscribed
          })
        );
      }
    } catch (err) {
      console.error(err.message);
      isSubscribed = false;
      dispatch(
        updateSubscription({
          isSubscribed
        })
      );
    }
    return isSubscribed;
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

export function checkSubscription(payload) {
  return async (dispatch, getState) => {
    const {
      expiryDate,
      androidSubscriptionState,
      isSubscribed
    } = getState().subscription;

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

        const isBillingRetryPeriodFinished =
          nowInMillis > billingRetryPeriodFinishDate;

        if (
          androidSubscriptionState === CANCELED ||
          isBillingRetryPeriodFinished
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

export function updateProduct(product = {}) {
  return {
    type: UPDATE_PRODUCT,
    product
  };
}
