import {
  UPDATE_SUBSCRIBER_ID,
  UPDATE_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION_ERROR,
  SHOW_PREMIUM_REQUIRED,
  HIDE_PREMIUM_REQUIRED,
  NOT_SUBSCRIBED,
  REQUIRING_PREMIUM_COUNTRIES,
  ACTIVE,
  CANCELED,
  CANCELLED,
  IN_GRACE_PERIOD,
  EXPIRED,
  PROCCESING,
  SHOW_LOGIN_REQUIRED,
  HIDE_LOGIN_REQUIRED,
  UNVERIFIED,
  DAYS_TO_TRY
} from './SubscriptionProvider.constants';
import API from '../../api';
import { isLogged } from '../../components/App/App.selectors';
import { isAndroid, isIOS } from '../../cordova-util';
import { formatTitle } from '../../components/Settings/Subscribe/Subscribe.helpers';
import { updateNavigationSettings } from '../../components/App/App.actions';

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

    const isInFreeCountry = state.subscription?.isInFreeCountry;
    const isSubscribed = state.subscription?.isSubscribed;
    if (!isOnTrialPeriod && !(isSubscribed || isInFreeCountry))
      disablePremiumFeaturesOnTrialPeriodEnded();

    return isOnTrialPeriod;

    function isUserOnTrialPeriod(createdAt) {
      if (!createdAt) return false; //this case are already created users
      const createdAtDate = new Date(createdAt);
      const actualDate = new Date();
      const tryLimitDate = createdAtDate.setDate(
        createdAtDate.getDate() + DAYS_TO_TRY
      );
      if (actualDate >= tryLimitDate) return false;
      return true;
    }

    function disablePremiumFeaturesOnTrialPeriodEnded() {
      dispatch(updateNavigationSettings({ improvePhraseActive: false }));
    }
  };
}

export function updateIsSubscribed(requestOrigin = 'unkwnown') {
  return async (dispatch, getState) => {
    let isSubscribed = false;
    let ownedProduct = '';
    let status = NOT_SUBSCRIBED;
    let expiryDate = null;
    const state = getState();
    dispatch(
      updateSubscription({
        lastUpdated: new Date().getTime()
      })
    );

    try {
      if (!isLogged(state)) {
        dispatch(
          updateSubscription({
            ownedProduct,
            status,
            isSubscribed,
            expiryDate
          })
        );
      } else {
        if (
          (isAndroid() || isIOS()) &&
          state.subscription.status === PROCCESING
        ) {
          const filterInAppPurchaseIOSTransactions = uniqueReceipt =>
            uniqueReceipt.transactions.filter(
              transaction =>
                transaction.transactionId !== 'appstore.application'
            );

          const localReceipts = isIOS()
            ? filterInAppPurchaseIOSTransactions(
                window.CdvPurchase.store.localReceipts[0]
              )
            : window.CdvPurchase.store.localReceipts;

          if (localReceipts.length) {
            //Restore purchases to pass to approved
            window.CdvPurchase.store.restorePurchases();
            return;
          }
          dispatch(
            updateSubscription({
              isSubscribed: false,
              status: NOT_SUBSCRIBED,
              ownedProduct: ''
            })
          );
          return;
        }

        if (isIOS()) {
          const iosLocalReceipt = window.CdvPurchase.store.localReceipts[0];
          if (state.subscription.status === UNVERIFIED && iosLocalReceipt) {
            dispatch(
              updateSubscription({
                ownedProduct: state.subscription.ownedProduct,
                status: PROCCESING,
                isSubscribed,
                expiryDate
              })
            );
            return window.CdvPurchase.store.verify(iosLocalReceipt);
          }
        }

        const userId = state.app.userData.id;
        const { status, product, transaction } = await API.getSubscriber(
          userId,
          requestOrigin
        );
        const getActualProduct = async (product, transaction) => {
          if (
            isIOS() &&
            transaction &&
            product &&
            transaction.productId !== product.subscriptionId
          ) {
            try {
              const product = state.subscription.products.find(
                product => product.subscriptionId === transaction.productId
              );

              const newProduct = {
                title: formatTitle(product.title),
                billingPeriod: product.billingPeriod,
                price: product.price,
                tag: product.tag,
                subscriptionId: product.subscriptionId
              };
              const apiProduct = {
                product: {
                  ...newProduct
                }
              };

              await API.updateSubscriber(apiProduct);
              return newProduct;
            } catch (err) {
              console.error(err);
              return product;
            }
          }
          return product;
        };

        const actualProduct = await getActualProduct(product, transaction);
        isSubscribed =
          status.toLowerCase() === ACTIVE ||
          status.toLowerCase() === CANCELED ||
          status.toLowerCase() === CANCELLED ||
          status.toLowerCase() === IN_GRACE_PERIOD
            ? true
            : false;
        if (actualProduct && isSubscribed) {
          ownedProduct = {
            billingPeriod: actualProduct.billingPeriod,
            id: actualProduct._id,
            price: actualProduct.price,
            subscriptionId: actualProduct.subscriptionId,
            tag: actualProduct.tag,
            title: actualProduct.title,
            paypalSubscriptionId: transaction ? transaction.subscriptionId : '',
            platform: transaction ? transaction.platform : ''
          };
        }
        if (transaction?.expiryDate) {
          expiryDate = transaction.expiryDate;
        }
        dispatch(
          updateSubscription({
            ownedProduct,
            status: status.toLowerCase(),
            isSubscribed,
            expiryDate
          })
        );
      }
    } catch (err) {
      console.error(getErrorMessage(err));

      isSubscribed = false;
      status = NOT_SUBSCRIBED;
      let ownedProduct = '';
      const isSubscriberNotFound =
        (err.response?.data?.error || err.error) === 'subscriber not found';

      if (isSubscriberNotFound) {
        dispatch(
          updateSubscription({
            ownedProduct,
            status,
            isSubscribed
          })
        );
      }
      //Handle subscription status if is offline
      expiryDate = state.subscription.expiryDate;
      status = state.subscription.status;
      isSubscribed = state.subscription.isSubscribed;

      if (expiryDate && isSubscribed) {
        const expiryDateFormat = new Date(expiryDate);
        const expiryDateMillis = expiryDateFormat.getTime();
        const nowInMillis = Date.now();
        const isExpired = nowInMillis > expiryDateMillis;

        const daysGracePeriod = 7;

        const billingRetryPeriodFinishDate =
          status === ACTIVE
            ? expiryDateFormat.setDate(
                expiryDateFormat.getDate() + daysGracePeriod
              )
            : expiryDateFormat;

        if (isExpired) {
          const isBillingRetryPeriodFinished =
            nowInMillis > billingRetryPeriodFinishDate;

          if (status === CANCELED || isBillingRetryPeriodFinished) {
            dispatch(
              updateSubscription({
                isSubscribed: false,
                status: EXPIRED,
                ownedProduct: ''
              })
            );
            return;
          }
          dispatch(
            updateSubscription({
              isSubscribed: true,
              expiryDate: billingRetryPeriodFinishDate,
              status: IN_GRACE_PERIOD
            })
          );
        }
      }
    }
    return isSubscribed;
  };

  function getErrorMessage(err) {
    return (
      err.message +
      '. ' +
      (err.response ? err.response?.data?.message : err.error)
    );
  }
}

export function updatePlans() {
  return async (dispatch, getState) => {
    const state = getState();
    try {
      const { data } = await API.listSubscriptions();
      const locationCode = isLogged(state)
        ? state.app.userData?.location?.countryCode
        : state.app.unloggedUserLocation?.countryCode;
      // get just subscriptions with active plans
      const plans = getActivePlans(data);
      const iosProducts = isIOS() ? window.CdvPurchase.store.products : null;
      const products = plans.map(plan => {
        const price = iosProducts
          ? getIOSPrice(iosProducts, plan.subscriptionId)
          : getPrice(plan.countries, locationCode);
        const result = {
          id: plan.planId,
          subscriptionId: plan.subscriptionId,
          billingPeriod: plan.period,
          price: price,
          title: plan.subscriptionName,
          tag: plan.tags[0],
          paypalId: plan.paypalId
        };
        return result;
      });

      dispatch(
        updateSubscription({
          products: [...products]
        })
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  function getPrice(countries, country) {
    let price = '';
    if (countries)
      countries.forEach(element => {
        if (element.regionCode === country) price = element.price;
      });
    return price;
  }

  function getIOSPrice(iosProducts, productId) {
    const product = iosProducts.find(product => product.id === productId);
    const units = product.raw.priceMicros / 1000000;
    return {
      currencyCode: product?.raw?.currency,
      units
    };
  }

  function getActivePlans(subscriptions) {
    let plans = [];
    if (subscriptions)
      subscriptions.forEach(subscription => {
        if (subscription.plans)
          subscription.plans.forEach(plan => {
            if (plan.status.toLowerCase() === 'active') {
              plan.subscriptionName = subscription.name;
              plan.subscriptionId = subscription.subscriptionId;
              plans.push(plan);
            }
          });
      });
    return plans;
  }
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

export function showPremiumRequired(
  { showTryPeriodFinishedMessages } = {
    showTryPeriodFinishedMessages: false
  }
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

export function showLoginRequired() {
  return {
    type: SHOW_LOGIN_REQUIRED
  };
}

export function hideLoginRequired() {
  return {
    type: HIDE_LOGIN_REQUIRED
  };
}
