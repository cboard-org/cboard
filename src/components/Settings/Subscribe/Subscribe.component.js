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
import Paper from '@material-ui/core/Paper';

import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Subscribe.messages';
import './Subscribe.css';

import {
  INCLUDED_FEATURES,
  EMPTY_PRODUCT,
  ERROR,
  ON_TRIAL_PERIOD
} from './Subscribe.constants';
import { formatDuration, formatTitle } from './Subscribe.helpers';
import { isAndroid } from '../../../cordova-util';
import { CircularProgress } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

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
    const canPurchase =
      subscription.androidSubscriptionState === NOT_SUBSCRIBED ||
      subscription.androidSubscriptionState === EXPIRED ||
      subscription.androidSubscriptionState === ON_HOLD;
    return [
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
        })}
      </Grid>
    ];
  };

  const renderSubscriptionStatus = () => {
    const {
      androidSubscriptionState,
      expiryDate,
      error,
      isOnTrialPeriod,
      isSubscribed
    } = subscription;

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

    return [
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
    ];
  };

  const subscriptionInfo = () => {
    const subscription = {
      plan: 'Premium All Features',
      status: 'active',
      planAmount: '3USD / month',
      nextPayment: '25/5/12'
    };
    return [
      <Paper elevation={3} className="Subscribe__Info">
        <Typography variant="h5">Subscription Info</Typography>
        <div className="Subscribe__Info__Container">
          <div className="Subscribe__Info__Table__Container">
            <Table aria-label="simple table">
              <TableBody>
                {Object.entries(subscription).map(row => (
                  <TableRow key={row[0]}>
                    <TableCell component="th" scope="row">
                      {row[0]}
                    </TableCell>
                    <TableCell align="right">
                      {row[0] === 'status' ? (
                        <Chip
                          label={row[1]}
                          size="small"
                          color="primary"
                          style={{ backgroundColor: 'green' }}
                        />
                      ) : (
                        row[1]
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="Subscribe__Info__Button__Container">
          <Button variant="contained" fullWidth={false} color="primary">
            <FormattedMessage {...messages.manageSubscription} />
          </Button>
        </div>
      </Paper>
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

        {!subscription.isSubscribed ? renderProducts() : subscriptionInfo()}
      </FullScreenDialog>
    </div>
  );
};

Subscribe.propTypes = propTypes;
Subscribe.defaultProps = defaultProps;

export default Subscribe;
