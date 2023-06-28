import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import API from '../../api';
import { isAndroid, isCordova } from '../../cordova-util';

import {
  updateIsInFreeCountry,
  updateIsSubscribed,
  updateSubscription,
  updatePlans,
  updateIsOnTrialPeriod,
  showPremiumRequired
} from './SubscriptionProvider.actions';
import { onCvaResume, cleanUpCvaOnResume } from '../../cordova-util';
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

  onResume = async () => {
    const {
      updateIsSubscribed,
      updateIsInFreeCountry,
      updateIsOnTrialPeriod
    } = this.props;
    const isOnResume = true;
    const requestOrigin =
      'Function: onCvaResume() - Component: SubscriptionProvider';
    await updateIsSubscribed(isOnResume, requestOrigin);
    updateIsInFreeCountry();
    updateIsOnTrialPeriod();
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

    if (isCordova()) onCvaResume(this.onResume);

    const requestOrigin =
      'Function: componentDidMount - Component: SubscriptionProvider';

    const isSubscribed = await updateIsSubscribed(false, requestOrigin);
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
      const isSubscribed = await updateIsSubscribed(false, requestOrigin);
      const isInFreeCountry = updateIsInFreeCountry();
      const isOnTrialPeriod = updateIsOnTrialPeriod();
      if (!isInFreeCountry && !isOnTrialPeriod && !isSubscribed && isLogged) {
        showPremiumRequired({ showTryPeriodFinishedMessages: true });
      }
    }
  };

  componentWillUnmount() {
    if (isCordova()) cleanUpCvaOnResume(this.onResume);
  }

  configPurchaseValidator = () => {
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
