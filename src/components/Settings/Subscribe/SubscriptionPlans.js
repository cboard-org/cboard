import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
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
  subscription: PropTypes.object.isRequired,
  onRefreshSubscription: PropTypes.func.isRequired,
  isLogged: PropTypes.bool.isRequired,
  onSubscribe: PropTypes.func.isRequired
};

const useStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: 360
  },
  titles: {
    fontWeight: 'bold',
    fontSize: '1.2rem'
  },
  icon: {
    color: 'green'
  }
});

const SubscriptionPlans = ({
  subscription,
  onRefreshSubscription,
  isLogged,
  onSubscribe
}) => {
  const {
    androidSubscriptionState,
    expiryDate,
    error,
    isOnTrialPeriod,
    isSubscribed,
    products
  } = subscription;

  const classes = useStyles();
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
        return androidSubscriptionState || NOT_SUBSCRIBED;
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

  const getMessage = () => {
    function errorMessage() {
      if (error && error.code === '0001') {
        return messages.googleAccountAlreadyOwns;
      }
      return messages.error;
    }
    return subscriptionStatus === ERROR
      ? errorMessage()
      : messages[subscriptionStatus] || messages.fallback;
  };

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
          {...getMessage()}
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
          return [
            <Grid
              key={product.id}
              item
              xs={12}
              sm={6}
              style={{ padding: '5px', maxWidth: 328 }}
            >
              <Card style={{ minWidth: 275 }} variant="outlined">
                <CardContent>
                  <Typography
                    color="secondary"
                    gutterBottom
                    className={classes.titles}
                  >
                    {formatTitle(product.title)}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      mb: 2
                    }}
                  >
                    <Typography
                      component="h2"
                      variant="h3"
                      color="text.primary"
                    >
                      {product.price.currencyCode} {product.price.units}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      /{formatDuration(product.billingPeriod)}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth={true}
                    color="primary"
                    {...(!isLogged
                      ? { component: Link, to: '/login-signup' }
                      : { onClick: onSubscribe(product) })}
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
                          <ListItemIcon className={classes.icon}>
                            <CheckCircleIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <FormattedMessage
                                {...messages[feature] || {
                                  ...messages.fallback
                                }}
                              />
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
        })}
      </Grid>
    </>
  );
};

SubscriptionPlans.propTypes = propTypes;

export default SubscriptionPlans;
