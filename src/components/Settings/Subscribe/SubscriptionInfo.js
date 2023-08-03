import React, { useState } from 'react';
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
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Box from '@material-ui/core/Box';
import { formatDuration } from './Subscribe.helpers';
import LoadingIcon from '../../UI/LoadingIcon';
import {
  ACTIVE,
  CANCELED,
  CANCELLED,
  IN_GRACE_PERIOD
} from '../../../providers/SubscriptionProvider/SubscriptionProvider.constants';

import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '../../UI/IconButton';
import { isAndroid } from '../../../cordova-util';

const propTypes = {
  ownedProduct: PropTypes.object.isRequired,
  expiryDate: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  onRefreshSubscription: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  onCancelSubscription: PropTypes.func.isRequired,
  cancelSubscriptionStatus: PropTypes.string.isRequired
};

const LABEL = 0;
const VALUE = 1;

const SubscriptionInfo = ({
  ownedProduct,
  expiryDate,
  status,
  onRefreshSubscription,
  intl,
  onCancelSubscription,
  cancelSubscriptionStatus
}) => {
  const [cancelDialog, setCancelDialog] = useState(false);
  const { title, billingPeriod, price } = ownedProduct;

  const planAmount = `${price?.currencyCode} ${price?.units} / ${formatDuration(
    billingPeriod
  )}`;

  const formatedDate = new Date(expiryDate).toLocaleString();

  const statusColor =
    status === ACTIVE
      ? { backgroundColor: 'green' }
      : { backgroundColor: 'darkorange' };

  const getPaymentLabel = () => {
    if (status === ACTIVE) return 'nextPayment';
    if (status === IN_GRACE_PERIOD) return 'fixPaymentIssue';
    if (status === CANCELED || status === CANCELLED) return 'premiumWillEnd';
  };

  const handleDialogClose = () => {
    setCancelDialog(false);
  };

  const subscription = {
    title,
    status: status,
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
                <TableRow key={row[LABEL]}>
                  <TableCell component="th" scope="row">
                    {row[LABEL] !== 'paymentLabel' ? (
                      <FormattedMessage {...messages[row[LABEL]]} />
                    ) : (
                      <FormattedMessage {...messages[getPaymentLabel()]} />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {row[LABEL] === 'status' ? (
                      <div>
                        <Chip
                          label={<FormattedMessage {...messages[row[VALUE]]} />}
                          size="small"
                          color="primary"
                          style={statusColor}
                        />
                        <IconButton
                          label={intl.formatMessage(messages.refresh)}
                          onClick={onRefreshSubscription}
                        >
                          <RefreshIcon />
                        </IconButton>
                      </div>
                    ) : (
                      row[VALUE]
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="Subscribe__Info__Button__Container">
        <Button
          variant={isAndroid() ? 'contained' : 'text'}
          fullWidth={false}
          color="primary"
          disabled={ownedProduct.platform === 'paypal' && status !== ACTIVE}
          onClick={() => {
            if (isAndroid() && ownedProduct.platform === 'android-playstore')
              window.CdvPurchase.store.manageSubscriptions();
            if (ownedProduct.platform === 'paypal') setCancelDialog(true);
            if (!isAndroid() && ownedProduct.platform === 'android-playstore')
              window.open(
                'https://play.google.com/store/account/subscriptions',
                '_blank'
              );
          }}
          style={{ marginLeft: '1em' }}
        >
          {' '}
          {ownedProduct.platform === 'android-playstore' ? (
            <FormattedMessage {...messages.manageSubscription} />
          ) : (
            <FormattedMessage {...messages.cancelSubscription} />
          )}
        </Button>
        <Dialog
          onClose={handleDialogClose}
          aria-labelledby="cancel-subscription-dialog"
          open={cancelDialog}
        >
          <DialogTitle
            id="cancel-subscription-title"
            onClose={handleDialogClose}
          >
            <FormattedMessage {...messages.cancelSubscription} />
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <FormattedMessage {...messages.cancelSubscriptionDescription} />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary" variant="text">
              <FormattedMessage {...messages.close} />
            </Button>
            <Button
              onClick={() => {
                onCancelSubscription(ownedProduct);
              }}
              variant="text"
              color="primary"
              disabled={
                cancelSubscriptionStatus === 'cancelling' ||
                cancelSubscriptionStatus === 'ok'
              }
            >
              {cancelSubscriptionStatus === 'cancelling' && <LoadingIcon />}
              <FormattedMessage {...messages.cancelSubscription} />
            </Button>
          </DialogActions>
          {(cancelSubscriptionStatus === 'ok' ||
            cancelSubscriptionStatus === 'error') && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '20px',
                mb: 2
              }}
            >
              {cancelSubscriptionStatus === 'ok' && (
                <Typography color="primary" variant="body1">
                  <FormattedMessage {...messages.canceledSubscriptionOk} />
                </Typography>
              )}
              {cancelSubscriptionStatus === 'error' && (
                <Typography color="error" variant="body1">
                  <FormattedMessage {...messages.canceledSubscriptionError} />
                </Typography>
              )}
            </Box>
          )}
        </Dialog>
      </div>
    </Paper>
  ];
};

SubscriptionInfo.propTypes = propTypes;

const mapStateToProps = ({
  subscription: { ownedProduct, expiryDate, status }
}) => ({
  ownedProduct,
  expiryDate,
  status
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(SubscriptionInfo));
