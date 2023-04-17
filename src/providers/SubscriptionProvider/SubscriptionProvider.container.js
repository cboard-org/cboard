import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import API from '../../api';
import { isAndroid } from '../../cordova-util';

import {
  updateIsInFreeCountry,
  updateIsSubscribed,
  updateSubscription,
  updatePlans,
  checkSubscription,
  updateIsOnTrialPeriod,
  showPremiumRequired
} from './SubscriptionProvider.actions';
import { onAndroidResume } from '../../cordova-util';
import {
  ACTIVE,
  CANCELED,
  IN_GRACE_PERIOD,
  NOT_SUBSCRIBED,
  PROCCESING
} from './SubscriptionProvider.constants';
import { isLogged } from '../../components/App/App.selectors';

export class SubscriptionProvider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  async componentDidMount() {
    const {
      isLogged,
      checkSubscription,
      updateIsSubscribed,
      updateIsOnTrialPeriod,
      updateIsInFreeCountry,
      showPremiumRequired,
      updatePlans
    } = this.props;
    console.log('entro en mount');

    if (isAndroid()) {
      const isSubscribed = await updateIsSubscribed();
      const isInFreeCountry = updateIsInFreeCountry();
      const isOnTrialPeriod = updateIsOnTrialPeriod();
      await updatePlans();
      this.configInAppPurchasePlugin();
      //onAndroidResume(() => checkSubscription());
      if (!isInFreeCountry && !isOnTrialPeriod && !isSubscribed && isLogged) {
        showPremiumRequired({ showTryPeriodFinishedMessages: true });
      }
    }
  }

  componentDidUpdate = async prevProps => {
    console.log('entro en update ');
    if (isAndroid()) {
      const {
        isLogged,
        updateIsSubscribed,
        updateIsInFreeCountry,
        updateIsOnTrialPeriod,
        subscriberId,
        androidSubscriptionState,
        checkSubscription
      } = this.props;
      if (!prevProps.isLogged && isLogged) {
        if (!prevProps.subscriberId && subscriberId) {
          const localTransaction = window.CdvPurchase.store.localTransactions;
          if (
            localTransaction.length ||
            androidSubscriptionState !== NOT_SUBSCRIBED
          )
            console.log('entro en first  ');
          // checkSubscription();
        }
      }
      if (prevProps.isLogged !== isLogged) {
        console.log('entro en second  ');
        const isSubscribed = await updateIsSubscribed();
        const isInFreeCountry = updateIsInFreeCountry();
        const isOnTrialPeriod = updateIsOnTrialPeriod();
        console.log(isInFreeCountry, isOnTrialPeriod, isSubscribed, isLogged);
        if (!isInFreeCountry && !isOnTrialPeriod && !isSubscribed && isLogged) {
          showPremiumRequired({ showTryPeriodFinishedMessages: true });
        }
      }
    }
  };

  configPurchaseValidator = () => {
    let count = 1;
    window.CdvPurchase.store.validator = async function(receipt, callback) {
      try {
        const transaction = receipt.transactions[0];
        const res = await API.postTransaction(transaction);
        if (!res.ok) throw res;
        callback({
          ok: true,
          data: res.data
        });
      } catch (err) {
        if (!err.ok && err.data) {
          callback({
            ok: false,
            code: err.data?.code, // **Validation error code
            message: err.error.message
          });
        } else {
          callback({
            ok: false,
            message: 'Unable to proceed with validation, ' + err.message
          });
        }
        if (count < 3) {
          setTimeout(() => {
            window.CdvPurchase.store.verify(receipt);
            count++;
          }, 1000 * count);
        }
        console.error(err);
      }
    };
    window.CdvPurchase.store.validator_privacy_policy = [
      'analytics',
      'support',
      'tracking',
      'fraud'
    ];
  };

  configInAppPurchasePlugin = () => {
    const { updateSubscription, androidSubscriptionState } = this.props;

    this.configPurchaseValidator();

    window.CdvPurchase.store
      .when()
      .productUpdated(product => {
        if (androidSubscriptionState === PROCCESING) {
          updateSubscription({
            isSubscribed: false,
            expiryDate: null,
            androidSubscriptionState: NOT_SUBSCRIBED
          });
        }
      })
      .receiptUpdated(receipt => {})
      .approved(receipt => {
        window.CdvPurchase.store.verify(receipt);
      })
      .verified(receipt => {
        console.log('entro en verified');
        const state = receipt.collection[0]?.subscriptionState;
        if ([ACTIVE, CANCELED, IN_GRACE_PERIOD].includes(state)) {
        updateSubscription({
          isSubscribed: true,
          expiryDate: receipt.collection[0].expiryDate,
          androidSubscriptionState: receipt.collection[0].subscriptionState
        });
        window.CdvPurchase.store.finish(receipt);
        }
      });
  };

  render() {
    const { children } = this.props;

    return React.Children.only(children);
  }
}

const mapStateToProps = state => ({
  isInFreeCountry: state.subscription.isInFreeCountry,
  isSubscribed: state.subscription.isSubscribed,
  expiryDate: state.subscription.expiryDate,
  androidSubscriptionState: state.subscription.androidSubscriptionState,
  isOnTrialPeriod: state.subscription.isOnTrialPeriod,
  isLogged: isLogged(state),
  subscriberId: state.subscription.subscriberId
});

const mapDispatchToProps = {
  updateIsSubscribed,
  updateSubscription,
  updatePlans,
  checkSubscription,
  updateIsInFreeCountry,
  updateIsOnTrialPeriod,
  showPremiumRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionProvider);
