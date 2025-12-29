import React from 'react';
import { connect } from 'react-redux';

import { hidePremiumRequired } from './../../providers/SubscriptionProvider/SubscriptionProvider.actions';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import WarningIcon from '@material-ui/icons/Warning';
import DialogContent from '@material-ui/core/DialogContent';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';
import messages from './PremiumFeature.messages';

import style from './PremiumRequiredModal.module.css';

function PremiumRequiredModal({
  hidePremiumRequired,
  premiumRequiredModalState
}) {
  const { open, showTryPeriodFinishedMessages } = premiumRequiredModalState;

  const dialogText = {
    title: showTryPeriodFinishedMessages ? (
      <FormattedMessage {...messages.tryPeriodFinishTitle} />
    ) : (
      <FormattedMessage {...messages.featureBlockedTitle} />
    ),
    body: <FormattedMessage {...messages.unlockBoardText} />
  };

  return (
    <Dialog
      open={open}
      onClose={hidePremiumRequired}
      maxWidth="md"
      aria-labelledby="dialog"
    >
      <DialogContent className={style.content}>
        <WarningIcon fontSize="large" color="action" />
        <Typography variant="h3">{dialogText.title}</Typography>
        <Typography className={style.dialogText} variant="h6">
          {dialogText.body}
        </Typography>
        <Button
          onClick={hidePremiumRequired}
          color="primary"
          variant="contained"
          size="large"
          component={Link}
          to="/settings/subscribe"
        >
          <FormattedMessage {...messages.upgradeNow} />
        </Button>
      </DialogContent>
    </Dialog>
  );
}

const mapStateToProps = ({ subscription: { premiumRequiredModalState } }) => ({
  premiumRequiredModalState
});

const mapDispatchToProps = {
  hidePremiumRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PremiumRequiredModal);
