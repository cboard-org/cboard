import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { DEFAULT_BOARDS } from '../../../../helpers';

import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../CommunicatorToolbar.messages';

import { IconButton } from '@material-ui/core';
import AppsIcon from '@mui/icons-material/Apps';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';
import { Stack, Typography } from '@mui/material';

import styles from './DefaultBoardSelector.module.css';
import DefaultBoardOption from './DefaultBoardOption';

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

  const defaultBoardsEntries = Object.entries(DEFAULT_BOARDS);

  const BoardsGallery = (
    <DialogContent>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{ display: 'flex' }}
        alignItems="strech"
        spacing={{ xs: 1, sm: 2, md: 4 }}
        mt={2}
      >
        {defaultBoardsEntries.map((board, defaultBoardIndex) => {
          //   Always first board is root board?
          const boards = board[1];
          if (boards?.length <= 1) return null;
          const rootBoard = boards[0];
          const ENTRIE_NAME_POSITION = 0;
          const defaultBoardName =
            defaultBoardsEntries[defaultBoardIndex][ENTRIE_NAME_POSITION];
          return (
            <DefaultBoardOption
              onClick={() => onOptionClick(defaultBoardName)}
              rootBoard={rootBoard}
              key={defaultBoardIndex}
              intl={intl}
            />
          );
        })}
      </Stack>
    </DialogContent>
  );

  const Confirmation = (
    <Fade in={isConfirming}>
      <div>
        <DialogContent>
          <DialogContentText mt={4}>
            <FormattedMessage {...messages.confirmChangeHomeBoardMessage} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <FormattedMessage {...messages.disagree} />
          </Button>
          <Button onClick={handleChangeDefaultBoard} autoFocus>
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
        maxWidth={'xl'}
      >
        <DialogTitle className={styles.dialogBar}>
          <Typography component="div" variant="h5" className={styles.header}>
            <FormattedMessage {...messages.selectDefaultBoardTitle} />
          </Typography>
          <IconButton
            label={intl.formatMessage(messages.close)}
            onClick={handleClose}
          >
            <CloseIcon className={styles.close} />
          </IconButton>
        </DialogTitle>
        {isConfirming ? Confirmation : BoardsGallery}
      </Dialog>
    </React.Fragment>
  );
};

DefaultBoardSelector.propTypes = { isDark: PropTypes.bool };
export default injectIntl(DefaultBoardSelector);
