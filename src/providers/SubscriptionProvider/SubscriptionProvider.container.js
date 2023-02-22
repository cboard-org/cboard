import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import API from '../../api';
import { isAndroid } from '../../cordova-util';

import {
  updateIsInFreeCountry,
  updateAndroidSubscriptionState,
  updateIsSubscribed,
  updateSubscription,
  comprobeSubscription,
  updateIsOnTrialPeriod
} from './SubscriptionProvider.actions';
import { onAndroidResume } from '../../cordova-util';
import { NOT_SUBSCRIBED, PROCCESING } from './SubscriptionProvider.constants';
import { isLogged } from '../../components/App/App.selectors';

export class SubscriptionProvider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  componentDidMount() {
    const {
      isSubscribed,
      comprobeSubscription,
      updateIsOnTrialPeriod,
      updateIsInFreeCountry
    } = this.props;

    if (isAndroid()) {
      this.configInAppPurchasePlugin();
      if (isSubscribed) {
        comprobeSubscription();
      }
      onAndroidResume(() => comprobeSubscription());
      updateIsInFreeCountry();
      updateIsOnTrialPeriod();
    }
  }

  componentDidUpdate = prevProps => {
    if (isAndroid()) {
      const {
        isLogged,
        updateIsInFreeCountry,
        updateIsOnTrialPeriod,
        subscriberId,
        androidSubscriptionState,
        comprobeSubscription
      } = this.props;
      if (!prevProps.isLogged && isLogged) {
        if (!prevProps.subscriberId && subscriberId) {
          const localTransaction = window.CdvPurchase.store.localTransactions;
          if (
            localTransaction.length ||
            androidSubscriptionState !== NOT_SUBSCRIBED
          )
            comprobeSubscription();
        }
      }
      if (prevProps.isLogged !== isLogged) {
        updateIsInFreeCountry();
        updateIsOnTrialPeriod();
      }
    }
  };

  configPurchaseValidator = () => {
    let count = 1;
    window.CdvPurchase.store.validator = async function(receipt, callback) {
      try {
        const transaction = receipt.transactions[0];
        //const transaction = receipt;
        console.log('receipt', receipt);
        const res = await API.postTransaction(transaction);
        console.log('res is: ', res);
        if (!res.ok) throw res;
        callback({
          ok: true,
          data: res.data
        });
      } catch (e) {
        if (!e.ok && e.data) {
          callback({
            ok: false,
            code: e.data?.code, // **Validation error code
            message: e.error.message
          });
        } else {
          callback({
            ok: false,
            message: 'Impossible to proceed with validation, ' + e
          });
        }
        if (count < 3) {
          setTimeout(() => {
            window.CdvPurchase.store.verify(receipt);
            count++;
          }, 1000 * count);
        }
        console.error(e);
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
    const {
      updateSubscription,
      androidSubscriptionState,
      subscriberId
    } = this.props;

    this.configPurchaseValidator();

    window.CdvPurchase.store
      .when()
      .productUpdated(product => {
        console.log('Product Updated', product);
        if (androidSubscriptionState === PROCCESING) {
          updateSubscription({
            isSubscribed: false,
            expiryDate: null,
            androidSubscriptionState: NOT_SUBSCRIBED
          });
        }
      })
      .receiptUpdated(receipt => {
        console.log('Receipt Updated', receipt);
      })
      .approved(receipt => {
        console.log('Approved - receipt: ', receipt);
        if (subscriberId) window.CdvPurchase.store.verify(receipt);
      })
      .verified(receipt => {
        console.log('Verified - Receipt', receipt);
        updateSubscription({
          isSubscribed: true,
          expiryDate: receipt.collection[0].expiryDate,
          androidSubscriptionState: receipt.collection[0].subscriptionState
        });
        window.CdvPurchase.store.finish(receipt);
      });
  };

  render() {
    const { children } = this.props;

    return React.Children.only(children);
  }
}

const mapStateToProps = state => ({
  isSubscribed: state.subscription.isSubscribed,
  expiryDate: state.subscription.expiryDate,
  androidSubscriptionState: state.subscription.androidSubscriptionState,
  isOnTrialPeriod: state.subscription.isOnTrialPeriod,
  isLogged: isLogged(state),
  subscriberId: state.subscription.subscriberId
});

const mapDispatchToProps = {
  updateAndroidSubscriptionState,
  updateIsSubscribed,
  updateSubscription,
  comprobeSubscription,
  updateIsInFreeCountry,
  updateIsOnTrialPeriod
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionProvider);
