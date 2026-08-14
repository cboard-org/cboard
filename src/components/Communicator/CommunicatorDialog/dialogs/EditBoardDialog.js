import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';

import InputImage from '../../../UI/InputImage';
import SymbolSearch from '../../../Board/SymbolSearch';
import LoadingIcon from '../../../UI/LoadingIcon';
import { isCordova } from '../../../../cordova-util';
import messages from '../CommunicatorDialog.messages';

const useStyles = makeStyles((theme) => ({
  imageBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2)
  },
  preview: {
    maxWidth: 200,
    maxHeight: 200,
    objectFit: 'contain'
  }
}));

const resolveCaption = (caption) =>
  isCordova() && caption && caption.search('/') === 0 ? `.${caption}` : caption;

const EditBoardDialog = ({
  intl,
  open,
  board,
  onUpdateBoard,
  onClose,
  disableTour,
  isSymbolSearchTourEnabled
}) => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [symbolSearchOpen, setSymbolSearchOpen] = useState(false);

  useEffect(() => {
    if (open && board) {
      setName(board.name || '');
      setDescription(board.description || '');
      setImage(null);
    }
  }, [open, board]);

  if (!board) return null;

  const handleSymbolSearchChange = ({ image: searchImage }) =>
    new Promise((resolve) => {
      setImage(searchImage);
      resolve();
    });

  const handleSave = async () => {
    setLoading(true);
    try {
      const newBoard = {
        ...board,
        name: name.trim() ? name : board.name,
        description: description ? description : board.description
      };
      if (image) newBoard.caption = image;
      await onUpdateBoard(newBoard);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const previewImage = resolveCaption(image || board.caption);

  return (
    <>
      <Dialog
        open={open}
        onClose={loading ? undefined : onClose}
        aria-labelledby="board-edit-title"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="board-edit-title">
          {intl.formatMessage(messages.editBoardTitle)}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {intl.formatMessage(messages.editBoardTitleDescription)}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            label={intl.formatMessage(messages.boardInfoName)}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            margin="dense"
            fullWidth
            multiline
            rowsMax={6}
            label={intl.formatMessage(messages.boardDescription)}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <div className={classes.imageBlock}>
            {previewImage && (
              <img
                className={classes.preview}
                src={previewImage}
                alt={board.name || ''}
              />
            )}
            <div>
              <Button
                color="primary"
                startIcon={<SearchIcon />}
                onClick={() => setSymbolSearchOpen(true)}
              >
                {intl.formatMessage(messages.imageSearch)}
              </Button>
              <InputImage onChange={(img) => setImage(img)} />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" disabled={loading}>
            {intl.formatMessage(messages.close)}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <LoadingIcon /> : intl.formatMessage(messages.accept)}
          </Button>
        </DialogActions>
      </Dialog>

      <SymbolSearch
        open={symbolSearchOpen}
        intl={intl}
        onChange={handleSymbolSearchChange}
        onClose={() => setSymbolSearchOpen(false)}
        disableTour={disableTour}
        isSymbolSearchTourEnabled={isSymbolSearchTourEnabled}
      />
    </>
  );
};

EditBoardDialog.propTypes = {
  intl: intlShape.isRequired,
  open: PropTypes.bool,
  board: PropTypes.object,
  onUpdateBoard: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  disableTour: PropTypes.func,
  isSymbolSearchTourEnabled: PropTypes.bool
};

export default EditBoardDialog;
