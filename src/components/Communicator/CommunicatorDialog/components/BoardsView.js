import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Pagination from '@material-ui/lab/Pagination';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import BoardCard from './BoardCard';
import BoardRow from './BoardRow';
import { VIEW_MODES } from '../CommunicatorDialog.constants';
import messages from '../CommunicatorDialog.messages';

const useStyles = makeStyles(theme => ({
  stateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(6, 2),
    color: theme.palette.text.secondary,
    textAlign: 'center'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1)
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2, 0)
  }
}));

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
  boardProps
}) => {
  const classes = useStyles();

  if (loading) {
    return (
      <div className={classes.stateContainer}>
        <CircularProgress />
      </div>
    );
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
        {intl.formatMessage(
          hasSearch ? messages.noBoardsFound : messages.emptyBoardsList
        )}
      </div>
    );
  }

  return (
    <>
      {viewMode === VIEW_MODES.GRID ? (
        <Grid container spacing={2}>
          {boards.map(board => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={board.id}>
              <BoardCard
                {...boardProps}
                board={board}
                busy={busyBoardId === board.id}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <div className={classes.list}>
          {boards.map(board => (
            <BoardRow
              {...boardProps}
              key={board.id}
              board={board}
              busy={busyBoardId === board.id}
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
  boardProps: PropTypes.object.isRequired
};

export default BoardsView;
