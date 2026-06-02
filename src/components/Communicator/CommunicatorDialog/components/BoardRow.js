import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import BoardThumb from './BoardThumb';
import BoardStatusIcons from './BoardStatusIcons';
import BoardActionsBar from './BoardActionsBar';
import { formatBoardLocale } from './boardLocale';
import {
  softRadius,
  surfaceInteractive,
  surfaceAccent,
  busyOverlay
} from './dashboardStyles';
import messages from '../CommunicatorDialog.messages';

const useStyles = makeStyles(theme => ({
  row: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(1, 1.5),
    borderRadius: softRadius(theme),
    ...surfaceInteractive(theme)
  },
  accent: surfaceAccent(theme),
  thumb: {
    width: 64,
    height: 64,
    flexShrink: 0,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`
  },
  main: {
    flex: 1,
    minWidth: 0
  },
  title: {
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  meta: {
    color: theme.palette.text.secondary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  status: {
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  busy: busyOverlay(theme)
}));

const BoardRow = ({
  intl,
  board,
  section,
  communicator,
  userData,
  activeBoardId,
  handlers,
  busy
}) => {
  const classes = useStyles();
  const title = board.name || board.id;
  const locale = formatBoardLocale(intl, board.locale);
  const accented =
    communicator.rootBoard === board.id || activeBoardId === board.id;
  const metaParts = [
    intl.formatMessage(messages.tilesQty, { qty: board.tiles.length }),
    locale,
    board.author &&
      intl.formatMessage(messages.author, { author: board.author }),
    moment(board.lastEdited).format('DD/MM/YYYY')
  ].filter(Boolean);

  return (
    <Paper
      variant="outlined"
      className={classNames(classes.row, { [classes.accent]: accented })}
    >
      {busy && (
        <div className={classes.busy}>
          <CircularProgress size={24} />
        </div>
      )}
      <BoardThumb board={board} className={classes.thumb} />
      <div className={classes.main}>
        <Typography className={classes.title} title={title}>
          {title}
        </Typography>
        <Typography variant="caption" className={classes.meta} component="p">
          {metaParts.join('  ·  ')}
        </Typography>
      </div>
      <div className={classes.status}>
        <BoardStatusIcons
          intl={intl}
          board={board}
          communicator={communicator}
          activeBoardId={activeBoardId}
        />
      </div>
      <BoardActionsBar
        intl={intl}
        board={board}
        section={section}
        communicator={communicator}
        userData={userData}
        activeBoardId={activeBoardId}
        handlers={handlers}
      />
    </Paper>
  );
};

BoardRow.propTypes = {
  intl: intlShape.isRequired,
  board: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired,
  communicator: PropTypes.object.isRequired,
  userData: PropTypes.object,
  activeBoardId: PropTypes.string,
  handlers: PropTypes.object.isRequired,
  busy: PropTypes.bool
};

export default BoardRow;
