import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import WarningIcon from '@material-ui/icons/Warning';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

import style from './PremiumRequiredModal.module.css';

export default function PremiumRequiredModal({ onClose }) {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      aria-labelledby="dialog"
    >
      <DialogContent className={style.content}>
        <WarningIcon fontSize="large" color="action" />
        <Typography variant="h3">Your free trial has ended</Typography>
        <DialogContentText className={style.subscribeButton}>
          <Typography variant="h6">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
            Let Google help apps determine location. This means sending
            anonymous locat Goorunninggle, even when no apps are.
          </Typography>
        </DialogContentText>
        <Button
          onClick={onClose}
          color="primary"
          variant="contained"
          size="large"
        >
          Upgrade now
        </Button>
      </DialogContent>
    </Dialog>
  );
}
