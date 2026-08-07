import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import ButtonBase from '@material-ui/core/ButtonBase';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import BoardThumb from './BoardThumb';
import BoardStatusIcons from './BoardStatusIcons';
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
  busy: busyOverlay(theme),
  trigger: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    textAlign: 'left',
    padding: theme.spacing(0.5)
  },
  selected: {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
  },
  star: {
    minWidth: 44,
    minHeight: 44
  },
  starActive: {
    color: theme.palette.warning.main
  }
}));

const BoardRow = ({
  intl,
  board,
  communicator,
  activeBoardId,
  selected,
  busy,
  onSelect,
  onToggleQuickAccess,
  registerTrigger
}) => {
  const classes = useStyles();
  const title = board.name || board.id;
  const locale = formatBoardLocale(intl, board.locale);
  const accented =
    communicator.rootBoard === board.id || activeBoardId === board.id;
  const inQuickAccess = communicator.boards.includes(board.id);
  const toggleLabel = intl.formatMessage(
    inQuickAccess ? messages.removeFromQuickAccess : messages.addToQuickAccess
  );
  const metaParts = [
    intl.formatMessage(messages.tilesQty, { qty: board.tiles.length }),
    locale,
    board.author &&
      intl.formatMessage(messages.author, { author: board.author }),
    moment(board.lastEdited).format('DD/MM/YYYY')
  ].filter(Boolean);

  const handleToggle = event => {
    event.stopPropagation();
    onToggleQuickAccess(board);
  };

  return (
    <Paper
      variant="outlined"
      className={classNames(classes.row, {
        [classes.accent]: accented,
        [classes.selected]: selected
      })}
    >
      {busy && (
        <div className={classes.busy}>
          <CircularProgress size={24} />
        </div>
      )}

      <ButtonBase
        className={classes.trigger}
        aria-current={selected || undefined}
        ref={node => registerTrigger(board.id, node)}
        onClick={() => onSelect(board.id)}
      >
        <BoardThumb board={board} className={classes.thumb} />
        <div className={classes.main}>
          <Typography className={classes.title} title={title}>
            {title}
          </Typography>
          <Typography variant="caption" className={classes.meta} component="p">
            {metaParts.join('  ·  ')}
          </Typography>
        </div>
      </ButtonBase>

      {inQuickAccess && (
        <Chip
          size="small"
          variant="outlined"
          label={intl.formatMessage(messages.inQuickAccess)}
        />
      )}

      <div className={classes.status}>
        <BoardStatusIcons
          intl={intl}
          board={board}
          communicator={communicator}
          activeBoardId={activeBoardId}
        />
      </div>

      <Tooltip title={toggleLabel}>
        <IconButton
          size="small"
          data-testid="quick-access-toggle"
          className={classNames(classes.star, {
            [classes.starActive]: inQuickAccess
          })}
          aria-label={toggleLabel}
          aria-pressed={inQuickAccess}
          onClick={handleToggle}
        >
          {inQuickAccess ? <StarIcon /> : <StarBorderIcon />}
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

BoardRow.defaultProps = {
  selected: false,
  busy: false
};

BoardRow.propTypes = {
  intl: intlShape.isRequired,
  board: PropTypes.object.isRequired,
  communicator: PropTypes.object.isRequired,
  activeBoardId: PropTypes.string,
  selected: PropTypes.bool,
  busy: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onToggleQuickAccess: PropTypes.func.isRequired,
  registerTrigger: PropTypes.func.isRequired
};

export default BoardRow;
