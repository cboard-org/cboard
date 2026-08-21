import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import HomeIcon from '@material-ui/icons/Home';
import StarIcon from '@material-ui/icons/Star';

import BoardThumb from '../shared/BoardThumb';
import {
  softRadius,
  surfaceInteractive,
  surfaceAccent,
  busyOverlay
} from '../CommunicatorDialog.styles';
import messages from '../CommunicatorDialog.messages';

const useStyles = makeStyles((theme) => ({
  row: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1, 1.5),
    borderRadius: softRadius(theme),
    ...surfaceInteractive(theme)
  },
  accent: surfaceAccent(theme),
  thumb: {
    width: 56,
    height: 56,
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
  control: {
    minWidth: 44,
    minHeight: 44
  },
  busy: busyOverlay(theme)
}));

const QuickAccessRow = ({
  intl,
  board,
  isRoot,
  isFirst,
  isLast,
  busy,
  onSetRoot,
  onRemove,
  onMoveUp,
  onMoveDown
}) => {
  const classes = useStyles();
  const title = board.name || board.id;
  const t = (msg) => intl.formatMessage(msg);

  return (
    <Paper
      variant="outlined"
      className={classNames(classes.row, { [classes.accent]: isRoot })}
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
        {isRoot && (
          <Chip size="small" variant="outlined" label={t(messages.rootBoard)} />
        )}
      </div>

      <Tooltip title={t(messages.moveUp)}>
        <span>
          <IconButton
            size="small"
            data-testid="move-up"
            className={classes.control}
            aria-label={`${t(messages.moveUp)}: ${title}`}
            disabled={isFirst}
            onClick={onMoveUp}
          >
            <ArrowUpwardIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title={t(messages.moveDown)}>
        <span>
          <IconButton
            size="small"
            data-testid="move-down"
            className={classes.control}
            aria-label={`${t(messages.moveDown)}: ${title}`}
            disabled={isLast}
            onClick={onMoveDown}
          >
            <ArrowDownwardIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title={t(messages.menuRootBoardOption)}>
        <span>
          <IconButton
            size="small"
            data-testid="set-root"
            className={classes.control}
            aria-label={`${t(messages.menuRootBoardOption)}: ${title}`}
            disabled={isRoot}
            onClick={onSetRoot}
          >
            <HomeIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title={t(messages.removeFromQuickAccess)}>
        <span>
          <IconButton
            size="small"
            data-testid="remove"
            className={classes.control}
            aria-label={`${t(messages.removeFromQuickAccess)}: ${title}`}
            disabled={isRoot}
            onClick={onRemove}
          >
            <StarIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Paper>
  );
};

QuickAccessRow.propTypes = {
  intl: intlShape.isRequired,
  board: PropTypes.object.isRequired,
  isRoot: PropTypes.bool,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  busy: PropTypes.bool,
  onSetRoot: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired
};

export default QuickAccessRow;
