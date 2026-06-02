import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import LanguageIcon from '@material-ui/icons/Language';

import BoardThumb from './BoardThumb';
import BoardStatusIcons from './BoardStatusIcons';
import BoardActionsBar from './BoardActionsBar';
import { formatBoardLocale } from './boardLocale';
import messages from '../CommunicatorDialog.messages';

const useStyles = makeStyles(theme => ({
  card: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  thumb: {
    height: 130,
    flexShrink: 0
  },
  content: {
    flex: 1,
    paddingBottom: theme.spacing(1)
  },
  title: {
    fontWeight: 600,
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
    marginTop: theme.spacing(0.5)
  },
  metaIcon: {
    fontSize: '1rem'
  },
  author: {
    color: theme.palette.text.secondary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 1, 2),
    gap: theme.spacing(1)
  },
  date: {
    fontSize: '0.75rem',
    color: theme.palette.text.hint
  },
  busy: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    zIndex: 2
  }
}));

const BoardCard = ({
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

  return (
    <Card variant="outlined" className={classes.card}>
      {busy && (
        <div className={classes.busy}>
          <CircularProgress size={28} />
        </div>
      )}
      <BoardThumb board={board} className={classes.thumb} />
      <CardContent className={classes.content}>
        <Typography variant="subtitle1" className={classes.title} title={title}>
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
              <LanguageIcon className={classes.metaIcon} />
              <Typography variant="caption" component="span">
                {locale}
              </Typography>
            </>
          )}
        </div>
        {board.author && (
          <Typography
            variant="caption"
            className={classes.author}
            component="p"
          >
            {intl.formatMessage(messages.author, { author: board.author })}
          </Typography>
        )}
        <Typography variant="caption" className={classes.date} component="p">
          {moment(board.lastEdited).format('DD/MM/YYYY')}
        </Typography>
      </CardContent>
      <div className={classes.footer}>
        <BoardStatusIcons
          intl={intl}
          board={board}
          communicator={communicator}
          activeBoardId={activeBoardId}
        />
        <BoardActionsBar
          intl={intl}
          board={board}
          section={section}
          communicator={communicator}
          userData={userData}
          activeBoardId={activeBoardId}
          handlers={handlers}
        />
      </div>
    </Card>
  );
};

BoardCard.propTypes = {
  intl: intlShape.isRequired,
  board: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired,
  communicator: PropTypes.object.isRequired,
  userData: PropTypes.object,
  activeBoardId: PropTypes.string,
  handlers: PropTypes.object.isRequired,
  busy: PropTypes.bool
};

export default BoardCard;
