import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  INCLUDED_FEATURES,
  EMPTY_PRODUCT,
  ERROR,
  ON_TRIAL_PERIOD
} from './Subscribe.constants';
import { formatDuration, formatTitle } from './Subscribe.helpers';
import { isAndroid } from '../../../cordova-util';
import { CircularProgress } from '@material-ui/core';

import { Link } from 'react-router-dom';
import RefreshIcon from '@material-ui/icons/Refresh';

import {
  EXPIRED,
  NOT_SUBSCRIBED,
  PROCCESING,
  ON_HOLD
} from '../../../providers/SubscriptionProvider/SubscriptionProvider.constants';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Alert from '@material-ui/lab/Alert';

import messages from './Subscribe.messages';
import './Subscribe.css';

const propTypes = {
  products: PropTypes.object.isRequired,
  subscription: PropTypes.object.isRequired,
  onRefreshSubscription: PropTypes.func.isRequired,
  isLogged: PropTypes.bool.isRequired,
  onSubscribe: PropTypes.func.isRequired
};

const SubscriptionPlans = ({
  subscription,
  products,
  onRefreshSubscription,
  isLogged,
  onSubscribe
}) => {
  const {
    androidSubscriptionState,
    expiryDate,
    error,
    isOnTrialPeriod,
    isSubscribed
  } = subscription;

  const canPurchase = [NOT_SUBSCRIBED, EXPIRED, ON_HOLD].includes(
    subscription.androidSubscriptionState
  );

  const subscriptionStatus = (function() {
    if (isAndroid()) {
      if (error.showError) return ERROR;
      if (
        isOnTrialPeriod &&
        !isSubscribed &&
        androidSubscriptionState !== PROCCESING
      )
        return ON_TRIAL_PERIOD;
      if (products.length || androidSubscriptionState !== NOT_SUBSCRIBED)
        return androidSubscriptionState;
      return EMPTY_PRODUCT;
    }
    return NOT_SUBSCRIBED;
  })();

  const alertProps = {
    active: 'success',
    canceled: 'warning',
    in_grace_period: 'warning',
    proccesing: 'info',
    not_subscribed: 'info',
    error: 'error',
    empty_product: 'warning',
    on_trial_period: 'info',

    on_hold: 'warning', //TODO
    paused: 'info', //TODO
    expired: 'warning' //TODO
  };

  const expiryDateFormated = expiryDate
    ? new Date(expiryDate).toLocaleString()
    : '';

  return (
    <>
      <Alert
        variant="filled"
        severity={alertProps[subscriptionStatus]}
        className="Subscribe__Alert"
        icon={
          subscriptionStatus === PROCCESING ? (
            <CircularProgress size={20} />
          ) : (
            ''
          )
        }
        action={
          ![ERROR, EMPTY_PRODUCT, ON_TRIAL_PERIOD].includes(
            subscriptionStatus
          ) && (
            <Button
              color="inherit"
              size="small"
              onClick={onRefreshSubscription}
            >
              <RefreshIcon />
            </Button>
          )
        }
      >
        <FormattedMessage
          {...messages[subscriptionStatus]}
          values={{ e: `${expiryDateFormated}` }}
        />
      </Alert>
      <Grid
        container
        spacing={0}
        alignItems="center"
        justifyContent="space-around"
      >
        {products.map(product => {
          return product.offers.map(offer => {
            return [
              <Grid
                key={offer.id}
                item
                xs={12}
                sm={6}
                style={{ padding: '5px', maxWidth: 328 }}
              >
                <Card style={{ minWidth: 275 }} variant="outlined">
                  <CardContent>
                    <Typography color="secondary" gutterBottom>
                      {formatTitle(product.title)}
                    </Typography>
                    <Typography variant="h3" component="div">
                      {offer.pricingPhases[0].price} /
                      {formatDuration(offer.pricingPhases[0].billingPeriod)}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth={true}
                      color="primary"
                      {...(!isLogged
                        ? { component: Link, to: '/login-signup' }
                        : { onClick: onSubscribe(product, offer) })}
                      disabled={!canPurchase}
                    >
                      <FormattedMessage {...messages.subscribe} />
                    </Button>
                    <Typography color="secondary">
                      <br />
                      <br />
                      <FormattedMessage {...messages.includedFeatures} />
                    </Typography>
                    <List disablePadding style={{ padding: '5px' }}>
                      {INCLUDED_FEATURES.map(feature => {
                        return [
                          <ListItem key={feature}>
                            <ListItemIcon>
                              <CheckCircleIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <FormattedMessage {...messages[feature]} />
                              }
                              secondary={null}
                            />
                          </ListItem>
                        ];
                      })}
                    </List>
                  </CardContent>
                  {/*  //TODO
                  <CardActions>
                    <Button size="small">Learn More</Button>
                  </CardActions> */}
                </Card>
              </Grid>
            ];
          });
        })}
      </Grid>
    </>
  );
};

SubscriptionPlans.propTypes = propTypes;

export default SubscriptionPlans;
