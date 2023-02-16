import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Alert from '@material-ui/lab/Alert';

import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Subscribe.messages';
import './Subscribe.css';

import { INCLUDED_FEATURES, EMPTY_PRODUCT, ERROR } from './Subscribe.constants';
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

const propTypes = {
  /**
   * Callback fired when clicking the back button
   */
  onClose: PropTypes.func,
  /**
   * Callback fired when clicking the subscribe button
   */
  subscribe: PropTypes.func.isRequired,
  /**
   * flag for user
   */
  isLogged: PropTypes.bool.isRequired,
  /**
   * Name of user
   */
  name: PropTypes.string.isRequired,
  /**
   * User email
   */
  email: PropTypes.string.isRequired,
  /**
   * Handle refresh subscription
   */
  onRefreshSubscription: PropTypes.func
};

const defaultProps = {
  name: '',
  email: '',
  location: { country: null, countryCode: null }
};

const Subscribe = ({
  onClose,
  isLogged,
  subscribe,
  name,
  email,
  location: { country, countryCode },
  onSubmitPeople,
  products,
  subscription,
  onRefreshSubscription
}) => {
  const renderIncludedFeatures = () => {
    return INCLUDED_FEATURES.map(feature => {
      return [
        <ListItem key={feature}>
          <ListItemIcon>
            <CheckCircleIcon />
          </ListItemIcon>
          <ListItemText
            primary={<FormattedMessage {...messages[feature]} />}
            secondary={null}
          />
        </ListItem>
      ];
    });
  };
  const renderProducts = () => {
    return products.map(product => {
      const canPurchase =
        subscription.androidSubscriptionState === NOT_SUBSCRIBED ||
        subscription.androidSubscriptionState === EXPIRED ||
        subscription.androidSubscriptionState === ON_HOLD;
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
                <Typography
                  sx={{ fontSize: 19 }}
                  color="secondary"
                  gutterBottom
                >
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
                    : { onClick: subscribe(product, offer) })}
                  disabled={!canPurchase}
                >
                  <FormattedMessage {...messages.subscribe} />
                </Button>
                <Typography sx={{ mb: 1.5 }} color="secondary">
                  <br />
                  <br />
                  <FormattedMessage {...messages.includedFeatures} />
                </Typography>
                <List disablePadding style={{ padding: '5px' }}>
                  {renderIncludedFeatures()}
                </List>
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        ];
      });
    });
  };

  const renderSubscriptionStatus = () => {
    const { androidSubscriptionState, expiryDate, error } = subscription;

    let productStatus = NOT_SUBSCRIBED;

    if (isAndroid()) {
      productStatus = error.showError
        ? ERROR
        : products.length
        ? androidSubscriptionState
        : EMPTY_PRODUCT;
    }

    const alertProps = {
      active: 'success',
      canceled: 'warning',
      in_grace_period: 'warning',
      proccesing: 'info',
      not_subscribed: 'info',
      error: 'error',
      empty_product: 'warning',

      on_hold: 'warning', //TODO
      paused: 'info', //TODO
      expired: 'warning' //TODO
    };

    const expiryDateFormated = expiryDate
      ? new Date(expiryDate).toLocaleString()
      : '';

    return [
      <Alert
        variant="filled"
        severity={alertProps[productStatus]}
        className="Subscribe__Alert"
        icon={
          productStatus === PROCCESING ? <CircularProgress size={20} /> : ''
        }
        action={
          [NOT_SUBSCRIBED, ERROR, EMPTY_PRODUCT].includes(productStatus) ? (
            ''
          ) : (
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
          {...messages[productStatus]}
          values={{ e: `${expiryDateFormated}` }}
        />
      </Alert>
    ];
  };

  return (
    <div className="Subscribe">
      <FullScreenDialog
        open
        title={<FormattedMessage {...messages.subscribe} />}
        onClose={onClose}
        // fullWidth
      >
        {renderSubscriptionStatus()}

        <div style={{}}>
          <Grid
            container
            spacing={0}
            alignItems="center"
            justifyContent="space-around"
          >
            {renderProducts()}
          </Grid>
        </div>
      </FullScreenDialog>
    </div>
  );
};

Subscribe.propTypes = propTypes;
Subscribe.defaultProps = defaultProps;

export default Subscribe;
