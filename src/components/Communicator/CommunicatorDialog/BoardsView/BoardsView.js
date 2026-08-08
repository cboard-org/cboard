import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { alpha, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Pagination from '@material-ui/lab/Pagination';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import SearchIcon from '@material-ui/icons/Search';
import InboxIcon from '@material-ui/icons/Inbox';

import BoardCard from './BoardCard';
import BoardRow from './BoardRow';
import { softRadius } from '../CommunicatorDialog.styles';
import { VIEW_MODES, BOARDS_PAGE_LIMIT } from '../CommunicatorDialog.constants';
import messages from '../CommunicatorDialog.messages';

const SKELETON_COUNT = BOARDS_PAGE_LIMIT;

const useStyles = makeStyles(theme => ({
  stateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(8, 2),
    color: theme.palette.text.secondary,
    textAlign: 'center'
  },
  emptyIconWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
    borderRadius: '50%',
    marginBottom: theme.spacing(2),
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main
  },
  emptyIcon: {
    fontSize: '2.25rem'
  },
  emptyText: {
    maxWidth: 320
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1)
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2, 0, 2)
  },
  skeletonCard: {
    borderRadius: softRadius(theme),
    overflow: 'hidden'
  },
  skeletonBody: {
    padding: theme.spacing(1.5)
  },
  skeletonRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(1, 1.5)
  }
}));

const LoadingState = ({ classes, viewMode }) => {
  if (viewMode === VIEW_MODES.LIST) {
    return (
      <div className={classes.list}>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div key={i} className={classes.skeletonRow}>
            <Skeleton variant="rect" width={64} height={64} />
            <div style={{ flex: 1 }}>
              <Skeleton width="40%" />
              <Skeleton width="70%" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <Grid container spacing={2}>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <Grid item xs={12} sm={6} md={6} lg={4} key={i}>
          <div className={classes.skeletonCard}>
            <Skeleton variant="rect" height={132} />
            <div className={classes.skeletonBody}>
              <Skeleton width="80%" />
              <Skeleton width="50%" />
              <Skeleton width="35%" />
            </div>
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

LoadingState.propTypes = {
  classes: PropTypes.object.isRequired,
  viewMode: PropTypes.string.isRequired
};

const BoardsView = ({
  intl,
  boards,
  viewMode,
  loading,
  error,
  hasSearch,
  page,
  totalPages,
  onPageChange,
  onRetry,
  busyBoardId,
  communicator,
  activeBoardId,
  selectedId,
  onSelect,
  onToggleQuickAccess,
  registerTrigger
}) => {
  const classes = useStyles();

  if (loading) {
    return <LoadingState classes={classes} viewMode={viewMode} />;
  }

  if (error) {
    return (
      <div className={classes.stateContainer}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={onRetry}>
              {intl.formatMessage(messages.tryAgain)}
            </Button>
          }
        >
          <AlertTitle>
            {intl.formatMessage(messages.errorGettingBoards)}
          </AlertTitle>
        </Alert>
      </div>
    );
  }

  if (!boards.length) {
    return (
      <div className={classes.stateContainer}>
        <div className={classes.emptyIconWrap}>
          {hasSearch ? (
            <SearchIcon className={classes.emptyIcon} />
          ) : (
            <InboxIcon className={classes.emptyIcon} />
          )}
        </div>
        <Typography variant="subtitle1" className={classes.emptyText}>
          {intl.formatMessage(
            hasSearch ? messages.noBoardsFound : messages.emptyBoardsList
          )}
        </Typography>
      </div>
    );
  }

  return (
    <>
      {viewMode === VIEW_MODES.GRID ? (
        <Grid container spacing={2}>
          {boards.map(board => (
            <Grid item xs={12} sm={6} md={6} lg={4} key={board.id}>
              <BoardCard
                intl={intl}
                board={board}
                communicator={communicator}
                activeBoardId={activeBoardId}
                selected={selectedId === board.id}
                busy={busyBoardId === board.id}
                onSelect={onSelect}
                onToggleQuickAccess={onToggleQuickAccess}
                registerTrigger={registerTrigger}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <div className={classes.list}>
          {boards.map(board => (
            <BoardRow
              key={board.id}
              intl={intl}
              board={board}
              communicator={communicator}
              activeBoardId={activeBoardId}
              selected={selectedId === board.id}
              busy={busyBoardId === board.id}
              onSelect={onSelect}
              onToggleQuickAccess={onToggleQuickAccess}
              registerTrigger={registerTrigger}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className={classes.pagination}>
          <Pagination
            count={totalPages}
            page={page}
            color="primary"
            shape="rounded"
            onChange={(event, value) => onPageChange(value)}
          />
        </div>
      )}
    </>
  );
};

BoardsView.propTypes = {
  intl: intlShape.isRequired,
  boards: PropTypes.array.isRequired,
  viewMode: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.object,
  hasSearch: PropTypes.bool,
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  busyBoardId: PropTypes.string,
  communicator: PropTypes.object.isRequired,
  activeBoardId: PropTypes.string,
  selectedId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onToggleQuickAccess: PropTypes.func.isRequired,
  registerTrigger: PropTypes.func.isRequired
};

export default BoardsView;
