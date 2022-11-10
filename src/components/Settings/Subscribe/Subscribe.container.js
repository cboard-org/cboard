import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Subscribe from './Subscribe.component';
import { getUser, isLogged } from '../../App/App.selectors';
import API from '../../../api';

import { isAndroid } from '../../../cordova-util';
import { AVAIABLE_PRODUCTS_ID } from './Suscribe.constants';

export class SubscribeContainer extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

  state = {
    name: this.props.user.name,
    email: this.props.user.email,
    products: []
  };

  componentDidMount() {
    if (isAndroid())
      window.CdvPurchase.store.when('subscription').updated(this.setProducts);
    //window.store.when('subscription').updated(this.setProducts);
    this.setProducts();
  }

  componentWillUnmount() {
    if (isAndroid()) window.CdvPurchase.store.off(this.setProducts); //window.store.off(this.setProducts);
  }

  setProducts = () => {
    if (isAndroid()) {
      // const products = AVAIABLE_PRODUCTS_ID.map(product => {
      //   //return window.store.get(product.subscriptionId);
      // });
      //return this.setState({ products: products });

      const validProducts = window.CdvPurchase.store.filter(
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
        alias: 'Chucha',
        price: 'USD 420',
        billingPeriodUnit: 'year',
        canPurchase: true,
        ...product
      },
      {
        id: '2',
        alias: 'a su madre',
        price: 'USD 2',
        billingPeriodUnit: 'month'
      },
      {
        id: '3',
        alias: 'a su madre',
        price: 'PEN 5',
        billingPeriodUnit: 'month'
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

  handleSubscribe = product => async event => {
    const { user, isLogged, location } = this.props;
    console.log(product, 'Este es el producto');
    if (isLogged) {
      const newSubscriber = {
        userId: user.id,
        country: location.countryCode || 'Not localized',
        status: 'algo',
        product: {
          planId: product.id,
          subscriptionId: product.id,
          status: product.state
        }
      };
      try {
        const data = await API.createSubscriber(newSubscriber);
        console.log(data, 'suscriber retrived');

        if (isAndroid()) {
          //window.store.order(product.id);
        }
      } catch (e) {
        console.error('Cannot suscribe product', e.message);
      }
      return;
    }

    //open modal
  };
  isOwned = products => {
    return !!this.findVerifiedPurchase(products, p => !p.isExpired);
  };

  isApproved(products) {
    return !!this.findLocalTransaction(
      products,
      t => t.state === window.CdvPurchase.TransactionState.APPROVED
    );
  }

  isInitiated(products) {
    return !!this.findLocalTransaction(
      products,
      t => t.state === window.CdvPurchase.TransactionState.INITIATED
    );
  }

  findVerifiedPurchase = (products, filter) => {
    for (const product of products) {
      const purchase = window.CdvPurchase.store.findInVerifiedReceipts(product);
      if (!purchase) continue;
      if (filter(purchase)) return purchase;
    }
  };

  // Find a local transaction for one of the provided products that passes the given filter.
  findLocalTransaction = (products, filter) => {
    // find if some of those products are part of a receipt
    for (const product of products) {
      const transaction = window.CdvPurchase.store.findInLocalReceipts(product);
      if (!transaction) continue;
      if (filter(transaction)) return transaction;
    }
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
    location: location
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscribeContainer);
