import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import LoadingIcon from '../../../UI/LoadingIcon';
import PremiumFeature from '../../../PremiumFeature';
import messages from '../CommunicatorDialog.messages';

/**
 * Captures a description before publishing a board (shown only when a board is
 * being made public and has no description yet). On accept it updates the board
 * description (if provided) and then publishes it.
 */
const PublishBoardDialog = ({
  intl,
  open,
  board,
  onUpdateBoard,
  onPublish,
  onClose
}) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(
    () => {
      if (open) setDescription(board ? board.description || '' : '');
    },
    [open, board]
  );

  if (!board) return null;

  const handlePublish = async () => {
    setLoading(true);
    try {
      if (description) {
        const updated = { ...board, description };
        await onUpdateBoard(updated);
        await onPublish(updated);
      } else {
        await onPublish(board);
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      aria-labelledby="board-publish-title"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="board-publish-title">
        {intl.formatMessage(messages.publishBoard)}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {intl.formatMessage(messages.publishBoardDescription)}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          fullWidth
          multiline
          rowsMax={6}
          label={intl.formatMessage(messages.boardDescription)}
          value={description}
          onChange={event => setDescription(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>
          {intl.formatMessage(messages.close)}
        </Button>
        <PremiumFeature>
          <Button
            onClick={handlePublish}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <LoadingIcon /> : intl.formatMessage(messages.accept)}
          </Button>
        </PremiumFeature>
      </DialogActions>
    </Dialog>
  );
};

PublishBoardDialog.propTypes = {
  intl: intlShape.isRequired,
  open: PropTypes.bool,
  board: PropTypes.object,
  onUpdateBoard: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default PublishBoardDialog;
