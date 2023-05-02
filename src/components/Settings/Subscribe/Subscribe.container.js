import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import Subscribe from './Subscribe.component';
import { getUser, isLogged } from '../../App/App.selectors';
import API from '../../../api';
import messages from './Subscribe.messages';

import { isAndroid } from '../../../cordova-util';
import {
  updateSubscriberId,
  updateSubscription,
  updateSubscriptionError,
  updateIsSubscribed,
  updatePlans
} from '../../../providers/SubscriptionProvider/SubscriptionProvider.actions';
import {
  NOT_SUBSCRIBED,
  PROCCESING,
  EXPIRED,
  ACTIVE,
  ON_HOLD
} from '../../../providers/SubscriptionProvider/SubscriptionProvider.constants';

import { formatTitle } from './Subscribe.helpers';

export class SubscribeContainer extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    history: PropTypes.object.isRequired,
    subscription: PropTypes.object.isRequired
  };

  state = {
    cancelSubscriptionStatus: ''
  };

  componentDidMount() {
    const { updateIsSubscribed, updatePlans } = this.props;
    updateIsSubscribed();
    updatePlans();
  }

  handleChange = name => event => {
    this.setState({
      ...this.state,
      [name]: event.target.value
    });
  };

  handleRefreshSubscription = () => {
    const { updateIsSubscribed, updatePlans } = this.props;
    updateIsSubscribed();
    updatePlans();
  };

  handleCancelSubscription = async ownedProduct => {
    const { updateIsSubscribed, updatePlans } = this.props;
    try {
      this.setState({ cancelSubscriptionStatus: 'cancelling' });
      await API.cancelPlan(ownedProduct.paypalSubscriptionId);
      this.setState({ cancelSubscriptionStatus: 'ok' });
      updateIsSubscribed();
      updatePlans();
    } catch (err) {
      console.error(err.message);
      this.setState({ cancelSubscriptionStatus: 'error' });
    }
  };

  handleError = e => {
    const { updateSubscriptionError, updateSubscription } = this.props;

    updateSubscriptionError({
      showError: true,
      message: e.message,
      code: e.code
    });

    updateSubscription({
      isSubscribed: false,
      expiryDate: null,
      status: NOT_SUBSCRIBED
    });

    setTimeout(() => {
      updateSubscriptionError({
        showError: false,
        message: '',
        code: ''
      });
    }, 3000);
  };

  handleSubscribeCancel = () => {
    const { updateSubscription } = this.props;
    updateSubscription({
      isSubscribed: false,
      expiryDate: null,
      status: NOT_SUBSCRIBED,
      ownedProduct: ''
    });
  };

  handlePaypalApprove = async (product, data) => {
    const { updateSubscription } = this.props;
    const {
      facilitatorAccessToken,
      orderID,
      paymentSource,
      subscriptionID
    } = data;
    const transaction = {
      className: 'Transaction',
      subscriptionId: subscriptionID,
      transactionId: subscriptionID,
      state: 'approved',
      products: [product],
      platform: paymentSource,
      nativePurchase: '',
      purchaseId: orderID,
      purchaseDate: '',
      isPending: false,
      subscriptionState: ACTIVE,
      expiryDate: '',
      facilitatorAccessToken
    };
    try {
      const res = await API.postTransaction(transaction);
      if (!res.ok) throw res;
      const subscriber = await API.getSubscriber();
      updateSubscription({
        ownedProduct: {
          ...product,
          paypalSubscriptionId: subscriptionID,
          paypalOrderId: orderID,
          platform: paymentSource
        },
        status: ACTIVE,
        isInFreeCountry: false,
        isOnTrialPeriod: false,
        isSubscribed: true,
        expiryDate: subscriber.transaction.expiryDate
      });
    } catch (err) {
      console.error('Cannot subscribe product. Error: ', err.message);
      this.handleError(err);
    }
  };

  handleSubscribe = async (product, data = '') => {
    const {
      intl,
      user,
      isLogged,
      location,
      updateSubscriberId,
      updateSubscription,
      subscription
    } = this.props;
    if (
      isLogged &&
      product &&
      [NOT_SUBSCRIBED, EXPIRED, ON_HOLD].includes(subscription.status)
    ) {
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

      updateSubscription({
        isSubscribed: false,
        expiryDate: null,
        status: PROCCESING,
        ownedProduct: ''
      });

      let localReceipts = '';
      let offers, offer;
      if (isAndroid()) {
        const storeProducts = await window.CdvPurchase.store.products;
        const prod = storeProducts.find(p => {
          return p.id === product.subscriptionId;
        });

        localReceipts = window.CdvPurchase.store.findInLocalReceipts(prod);

        // get offer from the plugin
        try {
          await window.CdvPurchase.store.update();
          offers = prod.offers;
          offer = offers.find(offer => offer.tags[0] === product.tag);
        } catch (err) {
          console.error('Cannot subscribe product. Error: ', err.message);
          this.handleError(err);
          return;
        }
      }

      try {
        // update the api
        const subscriber = await API.getSubscriber(user.id);
        updateSubscriberId(subscriber._id);

        // check if current subscriber already bought in this device
        if (
          localReceipts &&
          localReceipts.nativePurchase?.orderId !==
            subscriber.transaction?.transactionId
        ) {
          this.handleError({
            code: '0001',
            message: intl.formatMessage(messages.googleAccountAlreadyOwns)
          });
          return;
        }
        await API.updateSubscriber(apiProduct);

        // proceed with the purchase
        if (isAndroid()) {
          const order = await window.CdvPurchase.store.order(offer);
          if (order && order.isError) throw order;
          updateSubscription({
            ownedProduct: {
              ...product,
              platform: 'android-playstore'
            }
          });
        }
      } catch (err) {
        if (err.response?.data.error === 'subscriber not found') {
          // check if current subscriber already bought in this device
          if (localReceipts) {
            this.handleError({
              code: '0001',
              message: intl.formatMessage(messages.googleAccountAlreadyOwns)
            });
            return;
          }
          try {
            const newSubscriber = {
              userId: user.id,
              country: location.countryCode || 'Not localized',
              status: NOT_SUBSCRIBED,
              ...apiProduct
            };
            const res = await API.createSubscriber(newSubscriber);
            updateSubscriberId(res._id);
            if (isAndroid()) {
              const order = await window.CdvPurchase.store.order(offer);
              if (order && order.isError) throw order;
              updateSubscription({
                ownedProduct: {
                  ...product,
                  platform: 'android-playstore'
                }
              });
            }
          } catch (err) {
            console.error('Cannot subscribe product. Error: ', err.message);
            this.handleError(err);
          }
          return;
        }
        console.error('Cannot subscribe product. Error: ', err.message);
        this.handleError(err);
      }
    }
  };

  render() {
    const { history, location } = this.props;

    return (
      <Subscribe
        onClose={history.goBack}
        isLogged={this.props.isLogged}
        onSubscribe={this.handleSubscribe}
        location={location}
        subscription={this.props.subscription}
        updateSubscriberId={this.props.updateSubscriberId}
        onRefreshSubscription={this.handleRefreshSubscription}
        onSubscribeCancel={this.handleSubscribeCancel}
        onPaypalApprove={this.handlePaypalApprove}
        onCancelSubscription={this.handleCancelSubscription}
        cancelSubscriptionStatus={this.state.cancelSubscriptionStatus}
      />
    );
  }
}

const mapStateToProps = state => {
  const userIsLogged = isLogged(state);
  const user = getUser(state);
  const location = userIsLogged
    ? {
        country: user?.location?.country,
        countryCode: user?.location?.countryCode
      }
    : {
        country: state.app.unloggedUserLocation?.country,
        countryCode: state.app.unloggedUserLocation?.countryCode
      };
  return {
    isLogged: userIsLogged,
    user: user,
    location: location,
    subscription: state.subscription
  };
};

const mapDispatchToProps = {
  updateSubscriberId,
  updateSubscription,
  updateSubscriptionError,
  updateIsSubscribed,
  updatePlans
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(SubscribeContainer));
