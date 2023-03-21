import React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from './Subscribe.messages';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { formatDuration } from './Subscribe.helpers';
import {
  ACTIVE,
  CANCELED,
  IN_GRACE_PERIOD
} from '../../../providers/SubscriptionProvider/SubscriptionProvider.constants';

import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '../../UI/IconButton';

const propTypes = {
  product: PropTypes.object.isRequired,
  expiryDate: PropTypes.string.isRequired,
  androidSubscriptionState: PropTypes.string.isRequired,
  onRefreshSubscription: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired
};

const subscriptionInfo = ({
  product,
  expiryDate,
  androidSubscriptionState,
  onRefreshSubscription,
  intl
}) => {
  // const subscription = {
  //   plan: 'Premium All Features',
  //   status: 'active',
  //   planAmount: '3USD / month',
  //   nextPayment: '25/5/12'
  // };

  const { title, billingPeriod, price } = product;
  const planAmount = `${price} / ${formatDuration(billingPeriod)}`;

  const formatedDate = new Date(expiryDate).toLocaleString();

  const statusColor =
    androidSubscriptionState === ACTIVE
      ? { backgroundColor: 'green' }
      : { backgroundColor: 'darkorange' };

  const getPaymentLabel = () => {
    if (androidSubscriptionState === ACTIVE) return 'nextPayment';
    if (androidSubscriptionState === IN_GRACE_PERIOD) return 'fixPaymentIssue';
    if (androidSubscriptionState === CANCELED) return 'premiumWillEnd';
  };

  const subscription = {
    title,
    status: androidSubscriptionState,
    planAmount,
    paymentLabel: formatedDate
  };

  return [
    <Paper elevation={3} className="Subscribe__Info">
      <Typography variant="h5">
        <FormattedMessage {...messages.subscriptionInfo} />
      </Typography>
      <div className="Subscribe__Info__Container">
        <div className="Subscribe__Info__Table__Container">
          <Table aria-label="simple table">
            <TableBody>
              {Object.entries(subscription).map(row => (
                <TableRow key={row[0]}>
                  <TableCell component="th" scope="row">
                    {row[0] !== 'paymentLabel' ? (
                      <FormattedMessage {...messages[row[0]]} />
                    ) : (
                      <FormattedMessage {...messages[getPaymentLabel()]} />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {row[0] === 'status' ? (
                      <Chip
                        label={<FormattedMessage {...messages[row[1]]} />}
                        size="small"
                        color="primary"
                        style={statusColor}
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
        <IconButton
          label={intl.formatMessage(messages.refresh)}
          onClick={onRefreshSubscription}
        >
          <RefreshIcon />
        </IconButton>
        <Button
          variant="contained"
          fullWidth={false}
          color="primary"
          onClick={() => {
            window.CdvPurchase.store.manageSubscriptions();
          }}
          style={{ marginLeft: '1em' }}
        >
          <FormattedMessage {...messages.manageSubscription} />
        </Button>
      </div>
    </Paper>
  ];
};

subscriptionInfo.propTypes = propTypes;

const mapStateToProps = ({
  subscription: { product, expiryDate, androidSubscriptionState }
}) => ({
  product,
  expiryDate,
  androidSubscriptionState
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(subscriptionInfo));
