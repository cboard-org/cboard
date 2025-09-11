import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Typography,
  CircularProgress,
  Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GetAppIcon from '@material-ui/icons/GetApp';
import CloseIcon from '@material-ui/icons/Close';
import messages from './ExportDialog.messages';

const useStyles = makeStyles(theme => ({
  dialogPaper: {
    minWidth: '500px',
    maxWidth: '600px'
  },
  formControl: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '100%'
  },
  dateInputs: {
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(1)
  },
  exportButton: {
    marginLeft: theme.spacing(1)
  },
  progressWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2)
  },
  statsBox: {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(2)
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1)
  }
}));

const ExportDialog = ({
  open,
  onClose,
  onExport,
  communicationHistory,
  users,
  intl,
  isExporting
}) => {
  const classes = useStyles();
  const [dateRange, setDateRange] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');
  const [includeImages, setIncludeImages] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);

  const handleDateRangeChange = event => {
    setDateRange(event.target.value);
    if (event.target.value !== 'custom') {
      setCustomStartDate('');
      setCustomEndDate('');
    }
  };

  const getFilteredEntries = () => {
    let filtered = [...communicationHistory];

    // Filter by user
    if (selectedUser !== 'all') {
      filtered = filtered.filter(entry => entry.userId === selectedUser);
    }

    // Filter by date range
    let startDate = null;
    let endDate = moment().endOf('day');

    switch (dateRange) {
      case 'today':
        startDate = moment().startOf('day');
        break;
      case 'week':
        startDate = moment()
          .subtract(7, 'days')
          .startOf('day');
        break;
      case 'month':
        startDate = moment()
          .subtract(30, 'days')
          .startOf('day');
        break;
      case 'custom':
        if (customStartDate) {
          startDate = moment(customStartDate).startOf('day');
        }
        if (customEndDate) {
          endDate = moment(customEndDate).endOf('day');
        }
        break;
      default:
        // 'all' - no date filtering
        break;
    }

    if (startDate) {
      filtered = filtered.filter(entry => {
        const entryDate = moment(entry.timestamp);
        return (
          entryDate.isSameOrAfter(startDate) &&
          entryDate.isSameOrBefore(endDate)
        );
      });
    }

    return filtered;
  };

  const handleExport = () => {
    const filteredEntries = getFilteredEntries();
    const exportData = {
      entries: filteredEntries,
      userId: selectedUser === 'all' ? null : selectedUser,
      userName:
        selectedUser === 'all'
          ? 'All Users'
          : users.find(u => u.id === selectedUser)?.name || 'Unknown User',
      dateRange: {
        from: dateRange === 'custom' ? customStartDate : null,
        to: dateRange === 'custom' ? customEndDate : null,
        type: dateRange
      },
      options: {
        includeImages,
        includeSummary,
        includeMetadata
      },
      metadata: {
        exportDate: moment().toISOString(),
        totalEntries: filteredEntries.length
      }
    };

    onExport(exportData);
  };

  const filteredEntries = getFilteredEntries();
  const symbolCount = filteredEntries.filter(e => e.type === 'symbol').length;
  const phraseCount = filteredEntries.filter(e => e.type === 'phrase').length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      classes={{ paper: classes.dialogPaper }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <FormattedMessage {...messages.exportTitle} />
      </DialogTitle>
      <DialogContent>
        <FormControl className={classes.formControl}>
          <FormLabel component="legend">
            <FormattedMessage {...messages.selectUser} />
          </FormLabel>
          <RadioGroup
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
          >
            <FormControlLabel
              value="all"
              control={<Radio color="primary" />}
              label={intl.formatMessage(messages.allUsers)}
            />
            {users.map(user => (
              <FormControlLabel
                key={user.id}
                value={user.id}
                control={<Radio color="primary" />}
                label={user.name}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <FormControl className={classes.formControl}>
          <FormLabel component="legend">
            <FormattedMessage {...messages.dateRange} />
          </FormLabel>
          <RadioGroup value={dateRange} onChange={handleDateRangeChange}>
            <FormControlLabel
              value="all"
              control={<Radio color="primary" />}
              label={intl.formatMessage(messages.allTime)}
            />
            <FormControlLabel
              value="today"
              control={<Radio color="primary" />}
              label={intl.formatMessage(messages.today)}
            />
            <FormControlLabel
              value="week"
              control={<Radio color="primary" />}
              label={intl.formatMessage(messages.lastWeek)}
            />
            <FormControlLabel
              value="month"
              control={<Radio color="primary" />}
              label={intl.formatMessage(messages.lastMonth)}
            />
            <FormControlLabel
              value="custom"
              control={<Radio color="primary" />}
              label={intl.formatMessage(messages.customRange)}
            />
          </RadioGroup>

          {dateRange === 'custom' && (
            <div className={classes.dateInputs}>
              <TextField
                type="date"
                label={intl.formatMessage(messages.startDate)}
                value={customStartDate}
                onChange={e => setCustomStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                type="date"
                label={intl.formatMessage(messages.endDate)}
                value={customEndDate}
                onChange={e => setCustomEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </div>
          )}
        </FormControl>

        <FormControl className={classes.formControl}>
          <FormLabel component="legend">
            <FormattedMessage {...messages.exportOptions} />
          </FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                checked={includeImages}
                onChange={e => setIncludeImages(e.target.checked)}
                color="primary"
              />
            }
            label={intl.formatMessage(messages.includeImages)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={includeSummary}
                onChange={e => setIncludeSummary(e.target.checked)}
                color="primary"
              />
            }
            label={intl.formatMessage(messages.includeSummary)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={includeMetadata}
                onChange={e => setIncludeMetadata(e.target.checked)}
                color="primary"
              />
            }
            label={intl.formatMessage(messages.includeMetadata)}
          />
        </FormControl>

        <Box className={classes.statsBox}>
          <Typography variant="subtitle2" gutterBottom>
            <FormattedMessage {...messages.previewStats} />
          </Typography>
          <div className={classes.statItem}>
            <Typography variant="body2">
              <FormattedMessage {...messages.totalEntries} />
            </Typography>
            <Typography variant="body2" color="primary">
              {filteredEntries.length}
            </Typography>
          </div>
          <div className={classes.statItem}>
            <Typography variant="body2">
              <FormattedMessage {...messages.symbols} />
            </Typography>
            <Typography variant="body2" color="primary">
              {symbolCount}
            </Typography>
          </div>
          <div className={classes.statItem}>
            <Typography variant="body2">
              <FormattedMessage {...messages.phrases} />
            </Typography>
            <Typography variant="body2" color="primary">
              {phraseCount}
            </Typography>
          </div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isExporting}>
          <CloseIcon />
          <FormattedMessage {...messages.cancel} />
        </Button>
        <Button
          onClick={handleExport}
          color="primary"
          variant="contained"
          disabled={isExporting || filteredEntries.length === 0}
          className={classes.exportButton}
        >
          {isExporting ? (
            <div className={classes.progressWrapper}>
              <CircularProgress size={20} />
              <FormattedMessage {...messages.exporting} />
            </div>
          ) : (
            <>
              <GetAppIcon />
              <FormattedMessage {...messages.export} />
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ExportDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  communicationHistory: PropTypes.array.isRequired,
  users: PropTypes.array,
  intl: PropTypes.object.isRequired,
  isExporting: PropTypes.bool
};

ExportDialog.defaultProps = {
  users: [],
  isExporting: false
};

export default injectIntl(ExportDialog);
