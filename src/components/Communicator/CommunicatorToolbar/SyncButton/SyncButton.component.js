import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import CloudOffIcon from '@material-ui/icons/CloudOff';
import SyncIcon from '@material-ui/icons/Sync';
import OfflinePinIcon from '@material-ui/icons/OfflinePin';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import { SYNC_STATUS } from '../../../Board/Board.constants';
import messages from './SyncButton.messages';
import { SYNCED_DISPLAY_DURATION, DISPLAY_STATE } from './SyncButton.constants';
import './SyncButton.css';

const { SYNCED, PENDING, SYNCING } = SYNC_STATUS;
const {
  OFFLINE,
  WORKING_OFFLINE,
  SAVING,
  SYNCED: DISPLAY_SYNCED,
  PENDING: DISPLAY_PENDING,
  SYNC
} = DISPLAY_STATE;

const SyncButton = ({
  intl,
  isOnline,
  isSyncing,
  isFetching,
  isSaving,
  hasPendingBoards,
  onSyncClick
}) => {
  const [showSynced, setShowSynced] = useState(false);
  const prevSyncStatusRef = useRef(null);

  const getSyncStatus = () => {
    if (isSyncing || isFetching || isSaving) return SYNCING;
    if (hasPendingBoards) return PENDING;
    return SYNCED;
  };

  const syncStatus = getSyncStatus();

  useEffect(
    () => {
      if (prevSyncStatusRef.current === SYNCING && syncStatus === SYNCED) {
        setShowSynced(true);
        const timer = setTimeout(() => {
          setShowSynced(false);
        }, SYNCED_DISPLAY_DURATION);
        return () => clearTimeout(timer);
      }
      prevSyncStatusRef.current = syncStatus;
    },
    [syncStatus]
  );

  const getDisplayState = () => {
    if (!isOnline) {
      return syncStatus === PENDING ? WORKING_OFFLINE : OFFLINE;
    }
    if (syncStatus === SYNCING) return SAVING;
    if (syncStatus === PENDING) return PENDING;
    if (showSynced) return DISPLAY_SYNCED;
    return SYNC;
  };

  const displayState = getDisplayState();
  const isSyncDisabled = syncStatus === SYNCING;
  const baseClassName = classNames('SyncButton', `SyncButton--${displayState}`);

  const getAriaLabel = () => {
    switch (displayState) {
      case OFFLINE:
        return intl.formatMessage(messages.offline);
      case WORKING_OFFLINE:
        return intl.formatMessage(messages.workingOffline);
      case SAVING:
        return intl.formatMessage(messages.saving);
      case DISPLAY_SYNCED:
        return intl.formatMessage(messages.synced);
      case DISPLAY_PENDING:
      case SYNC:
      default:
        return intl.formatMessage(messages.sync);
    }
  };

  if (displayState === OFFLINE) {
    return (
      <Button
        className={baseClassName}
        aria-label={getAriaLabel()}
        style={{ color: amber[500] }}
      >
        <span className="SyncButton__label">
          {intl.formatMessage(messages.offline)}
        </span>
        <CloudOffIcon className="SyncButton__icon" />
      </Button>
    );
  }

  if (displayState === WORKING_OFFLINE) {
    return (
      <Button
        className={baseClassName}
        aria-label={getAriaLabel()}
        style={{ color: amber[500] }}
      >
        <span className="SyncButton__label">
          {intl.formatMessage(messages.workingOffline)}
        </span>
        <OfflinePinIcon className="SyncButton__icon" />
      </Button>
    );
  }

  if (displayState === SAVING) {
    return (
      <IconButton
        className={baseClassName}
        aria-label={getAriaLabel()}
        disabled={isSyncDisabled}
        onClick={onSyncClick}
        color="inherit"
      >
        <CircularProgress
          size={24}
          thickness={7}
          className="SyncButton__spinner"
          color="inherit"
        />
      </IconButton>
    );
  }

  if (displayState === SYNCED) {
    return (
      <IconButton
        className={baseClassName}
        aria-label={getAriaLabel()}
        onClick={onSyncClick}
        style={{ color: green[500] }}
      >
        <CloudDoneIcon className="SyncButton__icon" />
      </IconButton>
    );
  }

  return (
    <IconButton
      className={baseClassName}
      aria-label={getAriaLabel()}
      disabled={isSyncDisabled}
      onClick={onSyncClick}
      color="inherit"
    >
      <SyncIcon className="SyncButton__icon" />
    </IconButton>
  );
};

SyncButton.propTypes = {
  intl: PropTypes.object.isRequired,
  isOnline: PropTypes.bool,
  isSyncing: PropTypes.bool,
  isFetching: PropTypes.bool,
  isSaving: PropTypes.bool,
  hasPendingBoards: PropTypes.bool,
  onSyncClick: PropTypes.func
};

SyncButton.defaultProps = {
  isOnline: true,
  isSyncing: false,
  isFetching: false,
  isSaving: false,
  hasPendingBoards: false,
  onSyncClick: () => {}
};

export default SyncButton;
