import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import API from '../../api';
import { isAndroid, isIOS } from '../../cordova-util';

import {
  updateIsInFreeCountry,
  updateIsSubscribed,
  updateSubscription,
  updatePlans,
  updateIsOnTrialPeriod,
  updateSubscriptionError
} from './SubscriptionProvider.actions';
import {
  ACTIVE,
  CANCELED,
  IN_GRACE_PERIOD,
  EXPIRED,
  NOT_SUBSCRIBED,
  UNVERIFIED
} from './SubscriptionProvider.constants';
import { isLogged } from '../../components/App/App.selectors';

export class SubscriptionProvider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  async componentDidMount() {
    const {
      updateIsSubscribed,
      updateIsOnTrialPeriod,
      updateIsInFreeCountry,
      updatePlans
    } = this.props;

    const requestOrigin =
      'Function: componentDidMount - Component: SubscriptionProvider';
    await updateIsSubscribed(requestOrigin);
    updateIsInFreeCountry();
    updateIsOnTrialPeriod();
    await updatePlans();
    if (isAndroid() || isIOS()) this.configInAppPurchasePlugin();
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
      await updateIsSubscribed(requestOrigin);
      updateIsInFreeCountry();
      updateIsOnTrialPeriod();
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
        const transaction = isIOS()
          ? receipt.transaction
          : transformReceipt(receipt);

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
    const { updateSubscription, updateSubscriptionError } = this.props;

    this.configPurchaseValidator();

    window.CdvPurchase.store
      .when()
      .productUpdated(product => {})
      .receiptUpdated(receipt => {})
      .approved(receipt => {
        if (isLogged) window.CdvPurchase.store.verify(receipt);
      })
      .unverified(response => {
        if (isIOS()) {
          const networError =
            response.payload.message ===
              'Unable to proceed with validation, Network Error' ||
            'Unable to proceed with validation, timeout exceeded';
          if (networError) return;
          const isAccountAlreadyBought =
            response.payload.message === 'Transaction ID already exists';
          if (isAccountAlreadyBought) {
            const localReceipt = window.CdvPurchase.store.localReceipts[0];
            localReceipt.finish();
            window.CdvPurchase.store.finish(localReceipt);
            updateSubscriptionError({
              showError: true,
              message: response.payload.message,
              code: '0001'
            });
            setTimeout(() => {
              updateSubscriptionError({
                showError: false,
                message: '',
                code: ''
              });
            }, 3000);
          }
          const { isInFreeCountry, isOnTrialPeriod } = this.props;
          updateSubscription({
            status: isAccountAlreadyBought ? NOT_SUBSCRIBED : UNVERIFIED,
            isInFreeCountry: isInFreeCountry,
            isOnTrialPeriod: isOnTrialPeriod,
            isSubscribed: false,
            expiryDate: null
          });
        }
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
          return;
        }
        if ([EXPIRED, NOT_SUBSCRIBED].includes(state)) {
          const { isInFreeCountry, isOnTrialPeriod } = this.props;
          updateSubscription({
            status: state,
            isInFreeCountry: isInFreeCountry,
            isOnTrialPeriod: isOnTrialPeriod,
            isSubscribed: false,
            expiryDate: null
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
  updateSubscriptionError,
  updatePlans,
  updateIsInFreeCountry,
  updateIsOnTrialPeriod
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionProvider);
