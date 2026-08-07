import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import LanguageIcon from '@material-ui/icons/Language';
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
  card: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    borderRadius: softRadius(theme),
    overflow: 'hidden',
    ...surfaceInteractive(theme, { lift: true })
  },
  accent: surfaceAccent(theme),
  selected: {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
  },
  actionArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  thumb: {
    height: 132,
    flexShrink: 0
  },
  content: {
    flex: 1,
    width: '100%',
    paddingBottom: theme.spacing(1)
  },
  title: {
    fontWeight: 600,
    lineHeight: 1.3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.75)
  },
  metaIcon: {
    fontSize: '1rem'
  },
  badge: {
    marginTop: theme.spacing(0.75)
  },
  date: {
    fontSize: '0.75rem',
    color: theme.palette.text.hint
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 1, 1, 2),
    gap: theme.spacing(1),
    borderTop: `1px solid ${theme.palette.divider}`
  },
  star: {
    minWidth: 44,
    minHeight: 44
  },
  starActive: {
    color: theme.palette.warning.main
  },
  busy: busyOverlay(theme)
}));

const BoardCard = ({
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

  const handleToggle = event => {
    // The whole card is an activation target; the star must not select it.
    event.stopPropagation();
    onToggleQuickAccess(board);
  };

  return (
    <Card
      variant="outlined"
      className={classNames(classes.card, {
        [classes.accent]: accented,
        [classes.selected]: selected
      })}
    >
      {busy && (
        <div className={classes.busy}>
          <CircularProgress size={28} />
        </div>
      )}

      <CardActionArea
        className={classes.actionArea}
        aria-current={selected || undefined}
        ref={node => registerTrigger(board.id, node)}
        onClick={() => onSelect(board.id)}
      >
        <BoardThumb board={board} className={classes.thumb} />
        <CardContent className={classes.content}>
          <Typography
            variant="subtitle1"
            className={classes.title}
            title={title}
          >
            {title}
          </Typography>
          <div className={classes.meta}>
            <Typography variant="caption" component="span">
              {intl.formatMessage(messages.tilesQty, {
                qty: board.tiles.length
              })}
            </Typography>
            {locale && (
              <>
                <LanguageIcon className={classes.metaIcon} aria-hidden="true" />
                <Typography variant="caption" component="span">
                  {locale}
                </Typography>
              </>
            )}
          </div>
          {inQuickAccess && (
            <Chip
              size="small"
              variant="outlined"
              className={classes.badge}
              label={intl.formatMessage(messages.inQuickAccess)}
            />
          )}
          <Typography variant="caption" className={classes.date} component="p">
            {moment(board.lastEdited).format('DD/MM/YYYY')}
          </Typography>
        </CardContent>
      </CardActionArea>

      <div className={classes.footer}>
        <BoardStatusIcons
          intl={intl}
          board={board}
          communicator={communicator}
          activeBoardId={activeBoardId}
        />
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
      </div>
    </Card>
  );
};

BoardCard.defaultProps = {
  selected: false,
  busy: false
};

BoardCard.propTypes = {
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

export default BoardCard;
