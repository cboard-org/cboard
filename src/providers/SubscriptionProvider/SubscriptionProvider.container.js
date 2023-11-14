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
  updateIsOnTrialPeriod,
  showPremiumRequired
} from './SubscriptionProvider.actions';
import {
  ACTIVE,
  CANCELED,
  IN_GRACE_PERIOD
} from './SubscriptionProvider.constants';
import { isLogged } from '../../components/App/App.selectors';

export class SubscriptionProvider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  async componentDidMount() {
    const {
      isLogged,
      updateIsSubscribed,
      updateIsOnTrialPeriod,
      updateIsInFreeCountry,
      showPremiumRequired,
      updatePlans
    } = this.props;

    const requestOrigin =
      'Function: componentDidMount - Component: SubscriptionProvider';
    const isSubscribed = await updateIsSubscribed(requestOrigin);
    const isInFreeCountry = updateIsInFreeCountry();
    const isOnTrialPeriod = updateIsOnTrialPeriod();
    await updatePlans();
    if (isAndroid()) this.configInAppPurchasePlugin();
    if (!isInFreeCountry && !isOnTrialPeriod && !isSubscribed && isLogged) {
      showPremiumRequired({ showTryPeriodFinishedMessages: true });
    }
  }

  componentDidUpdate = async prevProps => {
    const {
      isLogged,
      updateIsSubscribed,
      updateIsInFreeCountry,
      updateIsOnTrialPeriod
    } = this.props;
    if (prevProps.isLogged !== isLogged) {
      const requestOrigin =
        'Function: componentDidUpdate - Component: SubscriptionProvider';
      const isSubscribed = await updateIsSubscribed(requestOrigin);
      const isInFreeCountry = updateIsInFreeCountry();
      const isOnTrialPeriod = updateIsOnTrialPeriod();
      if (!isInFreeCountry && !isOnTrialPeriod && !isSubscribed && isLogged) {
        showPremiumRequired({ showTryPeriodFinishedMessages: true });
      }
    }
  };

  configPurchaseValidator = () => {
    const transformReceipt = receipt => {
      const receiptTransaction = receipt.transaction;
      const receiptData = JSON.parse(receipt.transaction.receipt);
      const {
        packageName,
        productId,
        purchaseTime,
        purchaseState,
        purchaseToken,
        quantity,
        autoRenewing,
        acknowledged
      } = receiptData;
      const transaction = {
        className: 'Transaction',
        transactionId: receiptTransaction.id,
        state: 'approved',
        products: receipt.products,
        platform: receiptTransaction.type,
        nativePurchase: {
          orderId: receiptTransaction.id,
          packageName: packageName,
          productId: productId,
          purchaseTime: purchaseTime,
          purchaseState: purchaseState,
          purchaseToken: purchaseToken,
          quantity: quantity,
          autoRenewing: autoRenewing,
          acknowledged: acknowledged,
          productIds: receipt.products.map(product => product.id),
          signature: receiptTransaction.signature,
          receipt: receiptTransaction.receipt
        },
        purchaseId: purchaseToken,
        purchaseDate: new Date(purchaseTime),
        isPending: false,
        isAcknowledged: acknowledged,
        renewalIntent: 'Renew'
      };
      return transaction;
    };

    window.CdvPurchase.store.validator = async function(receipt, callback) {
      try {
        const transaction = isAndroid()
          ? transformReceipt(receipt)
          : receipt.transactions[0];

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
    const { updateSubscription } = this.props;

    this.configPurchaseValidator();

    window.CdvPurchase.store
      .when()
      .productUpdated(product => {})
      .receiptUpdated(receipt => {})
      .approved(receipt => {
        if (isLogged) window.CdvPurchase.store.verify(receipt);
      })
      .verified(async receipt => {
        const state = receipt.collection[0]?.subscriptionState;
        if ([ACTIVE, CANCELED, IN_GRACE_PERIOD].includes(state)) {
          updateSubscription({
            status: state,
            isInFreeCountry: false,
            isOnTrialPeriod: false,
            isSubscribed: true,
            expiryDate: receipt.collection[0].expiryDate
          });
          receipt.finish();
          window.CdvPurchase.store.finish(receipt);
        }
      })
      .finished(receipt => {});
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
  status: state.subscription.status,
  isOnTrialPeriod: state.subscription.isOnTrialPeriod,
  isLogged: isLogged(state),
  subscriberId: state.subscription.subscriberId
});

const mapDispatchToProps = {
  updateIsSubscribed,
  updateSubscription,
  updatePlans,
  updateIsInFreeCountry,
  updateIsOnTrialPeriod,
  showPremiumRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionProvider);
