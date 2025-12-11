import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { makeStyles } from '@material-ui/core/styles';
import FullScreenDialog from '../../UI/FullScreenDialog';
import ExportDialog from '../../CommunicationHistory/ExportDialog';
import messages from './CommunicationHistory.messages';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    height: '100%'
  },
  section: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3)
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1)
  },
  description: {
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3)
  },
  statCard: {
    padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main
  },
  statLabel: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5)
  },
  actions: {
    display: 'flex',
    gap: theme.spacing(2),
    flexWrap: 'wrap'
  },
  button: {
    textTransform: 'none'
  },
  warningText: {
    color: theme.palette.warning.main,
    marginTop: theme.spacing(2)
  }
}));

const CommunicationHistory = ({
  intl,
  communicationHistory,
  clearHistory,
  userData,
  history
}) => {
  const classes = useStyles();
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  const handleGoBack = () => {
    history.push('/settings');
  };

  const handleExportClick = () => {
    setExportDialogOpen(true);
  };

  const handleClearClick = () => {
    setClearConfirmOpen(true);
  };

  const handleClearConfirm = () => {
    clearHistory(userData?.email || null);
    setClearConfirmOpen(false);
  };

  // Calculate statistics
  const totalEntries = communicationHistory.length;
  const symbolCount = communicationHistory.filter(e => e.type === 'symbol')
    .length;
  const phraseCount = communicationHistory.filter(e => e.type === 'phrase')
    .length;
  const uniqueDays = new Set(communicationHistory.map(e => e.date)).size;

  return (
    <FullScreenDialog
      open
      title={<FormattedMessage {...messages.title} />}
      onClose={handleGoBack}
    >
      <div className={classes.root}>
        <Paper className={classes.section}>
          <div className={classes.sectionTitle}>
            <AssessmentIcon color="primary" />
            <Typography variant="h6">
              <FormattedMessage {...messages.overview} />
            </Typography>
          </div>

          <Typography className={classes.description}>
            <FormattedMessage {...messages.description} />
          </Typography>

          <div className={classes.statsGrid}>
            <div className={classes.statCard}>
              <div className={classes.statValue}>{totalEntries}</div>
              <div className={classes.statLabel}>
                <FormattedMessage {...messages.totalInteractions} />
              </div>
            </div>
            <div className={classes.statCard}>
              <div className={classes.statValue}>{symbolCount}</div>
              <div className={classes.statLabel}>
                <FormattedMessage {...messages.symbolsUsed} />
              </div>
            </div>
            <div className={classes.statCard}>
              <div className={classes.statValue}>{phraseCount}</div>
              <div className={classes.statLabel}>
                <FormattedMessage {...messages.phrasesSpoken} />
              </div>
            </div>
            <div className={classes.statCard}>
              <div className={classes.statValue}>{uniqueDays}</div>
              <div className={classes.statLabel}>
                <FormattedMessage {...messages.activeDays} />
              </div>
            </div>
          </div>

          <div className={classes.actions}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<GetAppIcon />}
              onClick={handleExportClick}
              className={classes.button}
              disabled={totalEntries === 0}
            >
              <FormattedMessage {...messages.exportPDF} />
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              size="large"
              startIcon={<DeleteIcon />}
              onClick={handleClearClick}
              className={classes.button}
              disabled={totalEntries === 0}
            >
              <FormattedMessage {...messages.clearHistory} />
            </Button>
          </div>

          {totalEntries === 0 && (
            <Typography className={classes.warningText}>
              <FormattedMessage {...messages.noDataAvailable} />
            </Typography>
          )}
        </Paper>

        <Paper className={classes.section}>
          <Typography variant="h6" gutterBottom>
            <FormattedMessage {...messages.privacyNote} />
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <FormattedMessage {...messages.privacyDescription} />
          </Typography>
        </Paper>
      </div>

      <ExportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
      />

      {/* Clear Confirmation Dialog */}
      {clearConfirmOpen && (
        <FullScreenDialog
          open={clearConfirmOpen}
          title={intl.formatMessage(messages.clearConfirmTitle)}
          onClose={() => setClearConfirmOpen(false)}
        >
          <Paper style={{ padding: '20px' }}>
            <Typography gutterBottom>
              <FormattedMessage {...messages.clearConfirmMessage} />
            </Typography>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClearConfirm}
              >
                <FormattedMessage {...messages.clearConfirm} />
              </Button>
              <Button
                variant="outlined"
                onClick={() => setClearConfirmOpen(false)}
              >
                <FormattedMessage {...messages.cancel} />
              </Button>
            </div>
          </Paper>
        </FullScreenDialog>
      )}
    </FullScreenDialog>
  );
};

CommunicationHistory.propTypes = {
  intl: PropTypes.object.isRequired,
  communicationHistory: PropTypes.array.isRequired,
  clearHistory: PropTypes.func.isRequired,
  userData: PropTypes.object,
  history: PropTypes.object.isRequired
};

export default injectIntl(CommunicationHistory);
