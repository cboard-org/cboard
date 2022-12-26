import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import API from '../../api';
import { isAndroid } from '../../cordova-util';

import {
  updateProductState,
  updateIsSubscribed,
  updateSubscription
} from './SubscriptionProvider.actions';
import { getProductStatus } from '../../components/Settings/Subscribe/Subscribe.helpers';
import { onAndroidResume } from '../../cordova-util';

export class SubscriptionProvider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  componentDidMount() {
    const { isSubscribed } = this.props;
    if (isAndroid()) {
      this.configInAppPurchasePlugin();
      if (isSubscribed) {
        this.comprobeSubscription();
      }
      onAndroidResume(() => this.comprobeSubscription());
    }
  }

  comprobeSubscription() {
    const { expiryDate, updateSubscription } = this.props;
    if (expiryDate) {
      const expiryDateFormat = new Date(expiryDate);
      const expiryDateMillis = expiryDateFormat.getTime();
      const nowInMillis = Date.now();
      const isExpired = nowInMillis > expiryDateMillis;

      console.log('expiricy date format ', expiryDateFormat);
      console.log('Now ', new Date());

      console.log('Is expired', isExpired);

      if (isExpired) {
        const isBillingRetryPeriodFinished = () => {
          const addBillingRetryPeriod = days => {
            //const expiryDate = new Date(expiryTimeMillisNumber);
            console.log('expiricy date format ', expiryDateFormat);
            const billingRetryPeriodFinishDate = expiryDateFormat.setDate(
              expiryDateFormat.getDate() + days
            );
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
          return addBillingRetryPeriod(14);
        };
        if (isBillingRetryPeriodFinished())
          updateSubscription({ isSubscribed: false, expiryDate: null });
      }
    }
  }

  configInAppPurchasePlugin = () => {
    const { updateSubscription } = this.props;
    let count = 0;
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
          console.error(e);
          return;
        }
        callback({
          ok: false,
          message: 'Impossible to proceed with validation, ' + e
        });
        if (count < 2) {
          setTimeout(() => {
            window.CdvPurchase.store.verify(receipt);
            count++;
          }, 1000);
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

    // window.store
    //   .when('subscription')
    //   .approved(p => {
    //     console.log('Porverificar', p);
    //     p.verify();
    //   })
    //   .verified(p => {
    //     console.log('Verificado, cambiar estado', p);
    //     p.finish();
    //   })
    //   .owned(p => console.log(`you now own ${p.alias}`));

    //updateIsSubscribed(false);

    window.CdvPurchase.store
      .when()
      .productUpdated(product => {
        const subscriptions = window.CdvPurchase.store.products.filter(
          p => p.type === window.CdvPurchase.ProductType.PAID_SUBSCRIPTION
        );
        console.log('ProductUpdated status: ', getProductStatus(subscriptions));
      })
      .receiptUpdated(receipt => {
        const subscriptions = window.CdvPurchase.store.products.filter(
          p => p.type === window.CdvPurchase.ProductType.PAID_SUBSCRIPTION
        );
        console.log(
          'receiptUpdated- product status',
          getProductStatus(subscriptions)
        );
      })
      .approved(receipt => {
        console.log('Porverificar', receipt);
        window.CdvPurchase.store.verify(receipt);
        const subscriptions = window.CdvPurchase.store.products.filter(
          p => p.type === window.CdvPurchase.ProductType.PAID_SUBSCRIPTION
        );
        console.log(
          'approved- product status',
          getProductStatus(subscriptions)
        );
      })
      .verified(receipt => {
        console.log('Verificado, cambiar estado', receipt);
        updateSubscription({
          isSubscribed: true,
          expiryDate: receipt.collection[0].expiryDate
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
  expiryDate: state.subscription.expiryDate
});

const mapDispatchToProps = {
  updateProductState,
  updateIsSubscribed,
  updateSubscription
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionProvider);
