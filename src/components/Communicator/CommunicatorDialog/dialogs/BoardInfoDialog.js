import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { isCordova } from '../../../../cordova-util';
import { formatBoardLocale } from '../utils/boardLocale';
import messages from '../CommunicatorDialog.messages';

const getBoardUrl = board =>
  `${window.location.origin}/${window.location.pathname.split('/')[1]}/${
    board.id
  }`;

const useStyles = makeStyles(theme => ({
  list: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    columnGap: theme.spacing(2),
    rowGap: theme.spacing(1)
  },
  label: {
    color: theme.palette.text.secondary,
    fontWeight: 600
  },
  value: {
    wordBreak: 'break-word'
  },
  openButton: {
    marginTop: theme.spacing(2)
  }
}));

const Row = ({ classes, label, children }) => (
  <>
    <Typography variant="body2" component="dt" className={classes.label}>
      {label}
    </Typography>
    <Typography variant="body2" component="dd" className={classes.value}>
      {children}
    </Typography>
  </>
);

Row.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string,
  children: PropTypes.node
};

const BoardInfoDialog = ({ intl, open, board, onClose }) => {
  const classes = useStyles();
  if (!board) return null;
  const boardUrl = getBoardUrl(board);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="board-info-title"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="board-info-title">{board.name}</DialogTitle>
      <DialogContent style={{ userSelect: 'text' }}>
        <dl className={classes.list}>
          <Row
            classes={classes}
            label={intl.formatMessage(messages.boardInfoName)}
          >
            {board.name}
          </Row>
          {board.author && (
            <Row
              classes={classes}
              label={intl.formatMessage(messages.boardInfoAuthor)}
            >
              {board.author}
            </Row>
          )}
          <Row
            classes={classes}
            label={intl.formatMessage(messages.boardInfoLocale)}
          >
            {formatBoardLocale(intl, board.locale)}
          </Row>
          {board.description && (
            <Row
              classes={classes}
              label={intl.formatMessage(messages.boardDescription)}
            >
              {board.description}
            </Row>
          )}
          <Row
            classes={classes}
            label={intl.formatMessage(messages.boardInfoDate)}
          >
            {moment(board.lastEdited).format('DD/MM/YYYY')}
          </Row>
          <Row
            classes={classes}
            label={intl.formatMessage(messages.boardInfoTiles)}
          >
            {board.tiles.length}
          </Row>
          <Row
            classes={classes}
            label={intl.formatMessage(messages.boardInfoId)}
          >
            {board.id}
          </Row>
        </dl>
        {!isCordova() && (
          <Button
            variant="outlined"
            fullWidth
            target="_blank"
            rel="noopener noreferrer"
            href={boardUrl}
            startIcon={<VisibilityIcon />}
            className={classes.openButton}
          >
            {intl.formatMessage(messages.openBoardInNewTab)}
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {intl.formatMessage(messages.close)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

BoardInfoDialog.propTypes = {
  intl: intlShape.isRequired,
  open: PropTypes.bool,
  board: PropTypes.object,
  onClose: PropTypes.func.isRequired
};

export default BoardInfoDialog;
