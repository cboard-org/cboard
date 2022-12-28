import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../CommunicatorToolbar.messages';

import { IconButton } from '@material-ui/core';
import AppsIcon from '@material-ui/icons/Apps';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import { Fade } from '@material-ui/core';
import { Typography } from '@material-ui/core';

import styles from './DefaultBoardSelector.module.css';
import DefaultBoardsGallery from './DefaultBoardsGallery';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} unmountOnExit />;
});

const DefaultBoardSelector = props => {
  const [open, setOpen] = useState(false);

  const defaultConfirmationState = {
    isConfirming: false,
    boardNameSelected: null
  };
  const [confirmationState, setConfirmation] = useState(
    defaultConfirmationState
  );

  const { intl, disabled, isDark, changeDefaultBoard } = props;

  const handleClickOpen = () => {
    setConfirmation(defaultConfirmationState);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onOptionClick = defaultBoardName => {
    setConfirmation({
      isConfirming: true,
      boardNameSelected: defaultBoardName
    });
  };

  const handleChangeDefaultBoard = () => {
    changeDefaultBoard(confirmationState.boardNameSelected);
    setOpen(false);
  };

  const { isConfirming } = confirmationState;

  const Confirmation = (
    <Fade in={isConfirming}>
      <div>
        <DialogContent>
          <FormattedMessage {...messages.confirmChangeHomeBoardMessage} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <FormattedMessage {...messages.disagree} />
          </Button>
          <Button color="primary" onClick={handleChangeDefaultBoard} autoFocus>
            <FormattedMessage {...messages.agree} />
          </Button>
        </DialogActions>
      </div>
    </Fade>
  );

  return (
    <React.Fragment>
      <IconButton
        label={intl.formatMessage(messages.defaultBoardsIconLabel)}
        disabled={disabled || open}
        onClick={handleClickOpen}
        className="default__boards__selector"
      >
        <AppsIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        scroll="paper"
        className={isDark ? styles.isDark : ''}
        fullWidth={false}
        maxWidth={'md'}
      >
        <DialogTitle className={styles.dialogBar}>
          <Typography component="div" variant="h5" className={styles.header}>
            <FormattedMessage {...messages.selectDefaultBoardTitle} />
            <IconButton
              label={intl.formatMessage(messages.close)}
              onClick={handleClose}
              className={styles.closeButton}
            >
              <CloseIcon className={styles.close} />
            </IconButton>
          </Typography>
        </DialogTitle>
        {isConfirming ? (
          Confirmation
        ) : (
          <DefaultBoardsGallery onOptionClick={onOptionClick} intl={intl} />
        )}
      </Dialog>
    </React.Fragment>
  );
};

DefaultBoardSelector.propTypes = { isDark: PropTypes.bool };
export default injectIntl(DefaultBoardSelector);
