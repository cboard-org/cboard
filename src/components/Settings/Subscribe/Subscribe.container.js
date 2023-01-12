import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Subscribe from './Subscribe.component';
import { getUser, isLogged } from '../../App/App.selectors';
import API from '../../../api';

import { isAndroid } from '../../../cordova-util';
import { AVAIABLE_PRODUCTS_ID } from './Subscribe.constants';
import { updateSubscriberId } from '../../../providers/SubscriptionProvider/SubscriptionProvider.actions';

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
    if (isAndroid())
      window.CdvPurchase.store.when('subscription').updated(this.setProducts);
    this.setProducts();
  }

  setProducts = () => {
    if (isAndroid()) {
      const validProducts = window.CdvPurchase.store.products.filter(
        product =>
          product.offers.length > 0 &&
          AVAIABLE_PRODUCTS_ID.some(p => p.subscriptionId === product.id)
      );
      console.log('products set products', validProducts);

      return this.setState({ products: validProducts });
    }

    const product = AVAIABLE_PRODUCTS_ID[0];
    const products = [
      {
        id: '1',
        title: 'Preimum full',
        offers: [
          {
            id: 'premiumfull@month',
            pricingPhases: [{ price: 'USD 6,00', billingPeriod: 'P1M' }]
          },
          {
            id: 'premiumfull@year',
            pricingPhases: [{ price: 'USD 50,00', billingPeriod: 'P1Y' }]
          }
        ]
      }
    ];
    this.setState({ products: products });
  };

  handleChange = name => event => {
    this.setState({
      ...this.state,
      [name]: event.target.value
    });
  };

  handleSubmit = async () => {};

  handleSubscribe = (product, offer) => async event => {
    const { user, isLogged, location, updateSubscriberId } = this.props;
    if (isAndroid()) {
      if (isLogged) {
        try {
          const subscriber = await API.getSubscriber(user.id);
          updateSubscriberId(subscriber._id);
          window.CdvPurchase.store.order(offer);
        } catch (e) {
          if (e.response?.data.error === 'subscriber not found') {
            try {
              const newSubscriber = {
                userId: user.id,
                country: location.countryCode || 'Not localized',
                status: 'algo',
                product: {
                  planId: offer.id,
                  subscriptionId: product.id,
                  status: 'valid'
                }
              };
              const res = await API.createSubscriber(newSubscriber);
              updateSubscriberId(res._id);
              window.CdvPurchase.store.order(offer);
            } catch (e) {
              console.error('Cannot subscribe product', e.message);
            }
          }
          console.error('Cannot subscribe product', e.message);
        }
      }
    }

    //TODO open modal
  };

  render() {
    const { history, location } = this.props;

    return (
      <Subscribe
        onClose={history.goBack}
        isLogged={this.props.isLogged}
        subscribe={this.handleSubscribe}
        name={this.state.name}
        email={this.state.email}
        location={location}
        onSubmitPeople={this.handleSubmit}
        products={this.state.products}
        subscription={this.props.subscription}
        updateSubscriberId={this.props.updateSubscriberId}
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
  updateSubscriberId
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscribeContainer);
