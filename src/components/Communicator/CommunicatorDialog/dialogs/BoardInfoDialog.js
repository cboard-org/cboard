import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { isCordova } from '../../../../cordova-util';
import { formatBoardLocale } from '../components/boardLocale';
import messages from '../CommunicatorDialog.messages';

const getBoardUrl = board =>
  `${window.location.origin}/${window.location.pathname.split('/')[1]}/${
    board.id
  }`;

const Row = ({ label, children }) => (
  <Typography variant="body2" gutterBottom>
    <b>{label}:</b> {children}
  </Typography>
);

const BoardInfoDialog = ({ intl, open, board, onClose }) => {
  if (!board) return null;
  const boardUrl = getBoardUrl(board);

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="board-info-title">
      <DialogTitle id="board-info-title">{board.name}</DialogTitle>
      <DialogContent style={{ userSelect: 'text' }}>
        <Row label={intl.formatMessage(messages.boardInfoName)}>
          {board.name}
        </Row>
        {board.author && (
          <Row label={intl.formatMessage(messages.boardInfoAuthor)}>
            {board.author}
          </Row>
        )}
        <Row label={intl.formatMessage(messages.boardInfoLocale)}>
          {formatBoardLocale(intl, board.locale)}
        </Row>
        {board.description && (
          <Row label={intl.formatMessage(messages.boardDescription)}>
            {board.description}
          </Row>
        )}
        <Row label={intl.formatMessage(messages.boardInfoDate)}>
          {moment(board.lastEdited).format('DD/MM/YYYY')}
        </Row>
        <Row label={intl.formatMessage(messages.boardInfoTiles)}>
          {board.tiles.length}
        </Row>
        <Row label={intl.formatMessage(messages.boardInfoId)}>{board.id}</Row>
        {!isCordova() && (
          <Button
            variant="outlined"
            target="_blank"
            rel="noopener noreferrer"
            href={boardUrl}
            startIcon={<VisibilityIcon />}
            style={{ marginTop: 8 }}
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
