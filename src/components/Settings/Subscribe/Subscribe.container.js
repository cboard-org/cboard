import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Subscribe from './Subscribe.component';
import { getUser, isLogged } from '../../App/App.selectors';
import API from '../../../api';

import { isAndroid } from '../../../cordova-util';
import {
  comprobeSubscription,
  updateSubscriberId,
  updateSubscription,
  updateAndroidSubscriptionState,
  updateSubscriptionError,
  updateProduct
} from '../../../providers/SubscriptionProvider/SubscriptionProvider.actions';
import {
  NOT_SUBSCRIBED,
  PROCCESING
} from '../../../providers/SubscriptionProvider/SubscriptionProvider.constants';

import { formatTitle } from './Subscribe.helpers';

export class SubscribeContainer extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    subscription: PropTypes.object.isRequired
  };

  state = {
    name: this.props.user.name,
    email: this.props.user.email,
    products: []
  };

  componentDidMount() {
    if (isAndroid()) {
      window.CdvPurchase.store.when('subscription').updated(this.setProducts);
      this.props.comprobeSubscription();
    }
    this.setProducts();
  }

  setProducts = async () => {
    if (isAndroid()) {
      let validProducts = [];
      try {
        validProducts = window.CdvPurchase.store.products.filter(
          product => product.offers.length > 0
        );
      } catch (err) {
        console.error(
          'Error getting subscription / product data. Error: ',
          err.message
        );
      }
      return this.setState({ products: validProducts });
    }
  };

  handleChange = name => event => {
    this.setState({
      ...this.state,
      [name]: event.target.value
    });
  };

  handleSubmit = async () => {};

  handleRefreshSubscription = () => {
    const { comprobeSubscription } = this.props;

    window.CdvPurchase.store.restorePurchases();
    comprobeSubscription();
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
      androidSubscriptionState: NOT_SUBSCRIBED
    });

    setTimeout(() => {
      updateSubscriptionError({
        showError: false,
        message: '',
        code: ''
      });
    }, 3000);
  };

  handleSubscribe = (product, offer) => async event => {
    const {
      user,
      isLogged,
      location,
      updateSubscriberId,
      updateSubscription,
      subscription,
      updateProduct
    } = this.props;
    if (isAndroid()) {
      if (
        isLogged &&
        subscription.androidSubscriptionState === NOT_SUBSCRIBED
      ) {
        const newProduct = {
          title: formatTitle(product.title),
          billingPeriod: offer.pricingPhases[0].billingPeriod,
          price: offer.pricingPhases[0].price
        };
        console.log(newProduct);
        const apiProduct = {
          product: {
            ...newProduct,
            subscriptionId: product.id
          }
        };
        console.log(apiProduct);

        try {
          updateSubscription({
            isSubscribed: false,
            expiryDate: null,
            androidSubscriptionState: PROCCESING
          });

          const subscriber = await API.getSubscriber(user.id);
          updateSubscriberId(subscriber._id);
          await API.updateSubscriber(apiProduct);
          updateProduct(newProduct);

          const order = await window.CdvPurchase.store.order(offer);
          if (order && order.isError) throw order;
        } catch (e) {
          if (e.response?.data.error === 'subscriber not found') {
            try {
              const newSubscriber = {
                userId: user.id,
                country: location.countryCode || 'Not localized',
                status: NOT_SUBSCRIBED,
                apiProduct
              };
              const res = await API.createSubscriber(newSubscriber);
              updateSubscriberId(res._id);
              updateProduct(newProduct);
              const order = await window.CdvPurchase.store.order(offer);
              if (order && order.isError) throw order;
            } catch (e) {
              console.error('Cannot subscribe product', e.message);
              this.handleError(e);
            }
            return;
          }
          console.error('Cannot subscribe product', e.message);
          this.handleError(e);
        }
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
        name={this.state.name}
        email={this.state.email}
        location={location}
        onSubmitPeople={this.handleSubmit}
        products={this.state.products}
        subscription={this.props.subscription}
        updateSubscriberId={this.props.updateSubscriberId}
        onRefreshSubscription={this.handleRefreshSubscription}
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
  comprobeSubscription,
  updateAndroidSubscriptionState,
  updateSubscriptionError,
  updateProduct
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscribeContainer);
