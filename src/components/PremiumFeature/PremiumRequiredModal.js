import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import WarningIcon from '@material-ui/icons/Warning';
import DialogContent from '@material-ui/core/DialogContent';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';
import messages from './PremiumFeature.messages';

import style from './PremiumRequiredModal.module.css';

export default function PremiumRequiredModal({ onClose, isTryPeriodFinish }) {
  const dialogText = {
    tittle: isTryPeriodFinish ? (
      <FormattedMessage {...messages.tryPeriodFinishTittle} />
    ) : (
      <FormattedMessage {...messages.featureBlockedTittle} />
    ),
    body: <FormattedMessage {...messages.featureBlockedText} />
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      aria-labelledby="dialog"
    >
      <DialogContent className={style.content}>
        <WarningIcon fontSize="large" color="action" />
        <Typography variant="h3">{dialogText.tittle}</Typography>
        <Typography className={style.dialogText} variant="h6">
          {dialogText.body}
        </Typography>
        <Button
          onClick={onClose}
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
