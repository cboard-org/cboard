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

const SyncButton = ({
  intl,
  isOnline,
  isSyncing,
  isFetching,
  hasPendingBoards,
  onSyncClick
}) => {
  const [showSynced, setShowSynced] = useState(false);
  const prevSyncStatusRef = useRef(null);

  const getSyncStatus = () => {
    if (isSyncing || isFetching) return SYNC_STATUS.SYNCING;
    if (hasPendingBoards) return SYNC_STATUS.PENDING;
    return SYNC_STATUS.SYNCED;
  };

  const syncStatus = getSyncStatus();

  useEffect(
    () => {
      if (
        prevSyncStatusRef.current === SYNC_STATUS.SYNCING &&
        syncStatus === SYNC_STATUS.SYNCED
      ) {
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
      return syncStatus === SYNC_STATUS.PENDING
        ? DISPLAY_STATE.WORKING_OFFLINE
        : DISPLAY_STATE.OFFLINE;
    }
    if (syncStatus === SYNC_STATUS.SYNCING) return DISPLAY_STATE.SAVING;
    if (syncStatus === SYNC_STATUS.PENDING) return DISPLAY_STATE.PENDING;
    if (showSynced) return DISPLAY_STATE.SYNCED;
    return DISPLAY_STATE.SYNC;
  };

  const displayState = getDisplayState();
  const isSyncDisabled = syncStatus === SYNC_STATUS.SYNCING;
  const baseClassName = classNames('SyncButton', `SyncButton--${displayState}`);

  const getAriaLabel = () => {
    switch (displayState) {
      case DISPLAY_STATE.OFFLINE:
        return intl.formatMessage(messages.offline);
      case DISPLAY_STATE.WORKING_OFFLINE:
        return intl.formatMessage(messages.workingOffline);
      case DISPLAY_STATE.SAVING:
        return intl.formatMessage(messages.saving);
      case DISPLAY_STATE.SYNCED:
        return intl.formatMessage(messages.synced);
      case DISPLAY_STATE.PENDING:
      case DISPLAY_STATE.SYNC:
      default:
        return intl.formatMessage(messages.sync);
    }
  };

  if (displayState === DISPLAY_STATE.OFFLINE) {
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

  if (displayState === DISPLAY_STATE.WORKING_OFFLINE) {
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

  if (displayState === DISPLAY_STATE.SAVING) {
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

  if (displayState === DISPLAY_STATE.SYNCED) {
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
  hasPendingBoards: PropTypes.bool,
  onSyncClick: PropTypes.func
};

SyncButton.defaultProps = {
  isOnline: true,
  isSyncing: false,
  isFetching: false,
  hasPendingBoards: false,
  onSyncClick: () => {}
};

export default SyncButton;
