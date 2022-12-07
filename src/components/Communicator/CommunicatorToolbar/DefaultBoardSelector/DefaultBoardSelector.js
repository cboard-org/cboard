import React, { useState } from 'react';
import PropTypes from 'prop-types';

import defaultBoards from '../../../../api/boards.json';

import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../CommunicatorToolbar.messages';

import { IconButton } from '@material-ui/core';
import AppsIcon from '@mui/icons-material/Apps';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import { Stack, Typography } from '@mui/material';

import styles from './DefaultBoardSelector.module.css';
import DefaultBoardOption from './DefaultBoardOption';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DefaultBoardSelector = props => {
  const [open, setOpen] = useState(false);

  const { intl, disabled, isDark } = props;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <IconButton
        label="selector of default boards"
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
        <DialogContent className={styles.dialogContent}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            sx={{ display: 'flex' }}
            alignItems="strech"
            spacing={{ xs: 1, sm: 2, md: 4 }}
            mt={2}
          >
            {Object.entries(defaultBoards).map((board, defaultBoardIndex) => {
              //   Always first board is root board?
              const boards = board[1];
              if (boards?.length <= 1) return null;
              const rootBoard = boards[0];
              return (
                <DefaultBoardOption
                  rootBoard={rootBoard}
                  key={defaultBoardIndex}
                />
              );
            })}
          </Stack>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

DefaultBoardSelector.propTypes = { isDark: PropTypes.bool };
export default injectIntl(DefaultBoardSelector);
