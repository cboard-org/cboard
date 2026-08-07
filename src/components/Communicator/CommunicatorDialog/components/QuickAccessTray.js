import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import QuickAccessRow from './QuickAccessRow';
import { softRadius } from './dashboardStyles';
import messages from '../CommunicatorDialog.messages';

const EXPLAINER_ID = 'CommunicatorDialog__quickAccessExplainer';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    maxWidth: 720
  },
  explainer: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1)
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    listStyle: 'none',
    margin: 0,
    padding: 0
  },
  addButton: {
    borderStyle: 'dashed',
    borderRadius: softRadius(theme),
    minHeight: 56,
    textTransform: 'none'
  },
  empty: {
    padding: theme.spacing(4, 2),
    color: theme.palette.text.secondary,
    textAlign: 'center'
  }
}));

/**
 * The communicator, presented as a short ordered tray rather than a second
 * board grid — the different shape is what tells the user this is a
 * quick-access subset of My Boards, not a separate collection.
 */
const QuickAccessTray = ({
  intl,
  boards,
  communicator,
  busyBoardId,
  onSetRoot,
  onRemove,
  onMove,
  onGoToMyBoards
}) => {
  const classes = useStyles();

  // Communicator order wins; ids with no visible board are skipped rather
  // than rendered as holes. The toolbar derives its list the same way.
  const orderedBoards = useMemo(
    () =>
      communicator.boards
        .map(boardId => boards.find(board => board.id === boardId))
        .filter(Boolean),
    [communicator.boards, boards]
  );

  const visibleIds = orderedBoards.map(board => board.id);

  const addButton = (
    <Button
      fullWidth
      variant="outlined"
      data-testid="go-to-my-boards"
      className={classes.addButton}
      startIcon={<AddIcon />}
      onClick={onGoToMyBoards}
    >
      {intl.formatMessage(messages.quickAccessAddFromMyBoards)}
    </Button>
  );

  if (!orderedBoards.length) {
    return (
      <div className={classes.root}>
        <div className={classes.empty}>
          <Typography variant="subtitle1">
            {intl.formatMessage(messages.quickAccessEmpty)}
          </Typography>
        </div>
        {addButton}
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Typography
        id={EXPLAINER_ID}
        variant="body2"
        component="p"
        className={classes.explainer}
      >
        {intl.formatMessage(messages.quickAccessExplainer, {
          qty: orderedBoards.length
        })}
      </Typography>

      <ul className={classes.list} aria-describedby={EXPLAINER_ID}>
        {orderedBoards.map((board, index) => (
          <li key={board.id}>
            <QuickAccessRow
              intl={intl}
              board={board}
              isRoot={communicator.rootBoard === board.id}
              isFirst={index === 0}
              isLast={index === orderedBoards.length - 1}
              busy={busyBoardId === board.id}
              onSetRoot={() => onSetRoot(board)}
              onRemove={() => onRemove(board)}
              onMoveUp={() => onMove(board.id, -1, visibleIds)}
              onMoveDown={() => onMove(board.id, 1, visibleIds)}
            />
          </li>
        ))}
      </ul>

      {addButton}
    </div>
  );
};

QuickAccessTray.propTypes = {
  intl: intlShape.isRequired,
  boards: PropTypes.array.isRequired,
  communicator: PropTypes.object.isRequired,
  busyBoardId: PropTypes.string,
  onSetRoot: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onGoToMyBoards: PropTypes.func.isRequired
};

export default QuickAccessTray;
