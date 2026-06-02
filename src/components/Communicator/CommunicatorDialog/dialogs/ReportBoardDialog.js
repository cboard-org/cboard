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
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import FlagIcon from '@material-ui/icons/Flag';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import messages from '../CommunicatorDialog.messages';

const getBoardUrl = board =>
  `${window.location.origin}/${window.location.pathname.split('/')[1]}/${
    board.id
  }`;

const ReportBoardDialog = ({
  intl,
  open,
  board,
  userData,
  onReport,
  onClose
}) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(
    () => {
      if (open) {
        setReason('');
        setLoading(false);
        setError(false);
        setSuccess(false);
      }
    },
    [open]
  );

  if (!board) return null;

  const handleSend = async () => {
    const reportData = {
      id: board.id,
      name: board.name,
      author: board.author,
      description: board.description,
      url: getBoardUrl(board),
      reason,
      whistleblower: {
        name: userData && userData.name,
        email: userData && userData.email
      }
    };
    setLoading(true);
    setError(false);
    try {
      await onReport(reportData);
      setSuccess(true);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      aria-labelledby="board-report-title"
    >
      <DialogTitle id="board-report-title">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8
          }}
        >
          {intl.formatMessage(messages.boardReport)}
          <FlagIcon />
        </div>
      </DialogTitle>

      {success ? (
        <>
          <DialogContent>
            <div style={{ textAlign: 'center' }}>
              <CheckCircleIcon
                color="primary"
                style={{ fontSize: '3rem', marginBottom: 16 }}
              />
              <DialogContentText>
                {intl.formatMessage(messages.boardReportSuccesSubtitle)}
                <br />
                {intl.formatMessage(messages.boardReportSuccesGratitude)}
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} variant="contained" color="primary">
              {intl.formatMessage(messages.boardReportClose)}
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogContent>
            <DialogContentText>
              {intl.formatMessage(messages.boardReportContentSubtitle)}
              <br />
              <br />
              {intl.formatMessage(messages.boardInfoName)}
              <br />
              <b>{board.name}</b>
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              fullWidth
              multiline
              minRows={1}
              required
              label={intl.formatMessage(messages.boardReport)}
              value={reason}
              onChange={event => setReason(event.target.value)}
            />
            {error && (
              <Typography color="error" variant="body2">
                {intl.formatMessage(messages.boardReportError)}
              </Typography>
            )}
            {loading && <LinearProgress style={{ marginTop: 16 }} />}
          </DialogContent>
          {!loading && (
            <DialogActions>
              <Button onClick={onClose} color="default" variant="contained">
                {intl.formatMessage(messages.boardReportCancel)}
              </Button>
              <Button
                onClick={handleSend}
                variant="contained"
                color="primary"
                disabled={!reason}
              >
                {intl.formatMessage(messages.boardReportSend)}
              </Button>
            </DialogActions>
          )}
        </>
      )}
    </Dialog>
  );
};

ReportBoardDialog.propTypes = {
  intl: intlShape.isRequired,
  open: PropTypes.bool,
  board: PropTypes.object,
  userData: PropTypes.object,
  onReport: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ReportBoardDialog;
