import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import BoardThumb from './BoardThumb';
import BoardStatusIcons from './BoardStatusIcons';
import { formatBoardLocale } from './boardLocale';
import PremiumFeature from '../../../PremiumFeature';
import messages from '../CommunicatorDialog.messages';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1, 2)
  },
  thumb: {
    width: '100%',
    height: 120,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`
  },
  title: {
    fontWeight: 600
  },
  meta: {
    color: theme.palette.text.secondary
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5)
  },
  action: {
    // Full-width, left-aligned, labelled. Comfortably above the 44px target
    // minimum in both themes.
    justifyContent: 'flex-start',
    minHeight: 44,
    textTransform: 'none'
  },
  destructive: {
    color: theme.palette.error.main
  },
  empty: {
    padding: theme.spacing(4, 2),
    color: theme.palette.text.secondary,
    textAlign: 'center'
  }
}));

const ActionButton = ({ action, busy, classes }) => {
  const button = (
    <Button
      fullWidth
      data-action-key={action.key}
      className={`${classes.action} ${
        action.destructive ? classes.destructive : ''
      }`}
      disabled={!!action.disabled || busy}
      title={action.hint}
      startIcon={action.icon}
      onClick={action.onClick}
    >
      {action.label}
    </Button>
  );

  return action.premium ? <PremiumFeature>{button}</PremiumFeature> : button;
};

ActionButton.propTypes = {
  action: PropTypes.object.isRequired,
  busy: PropTypes.bool,
  classes: PropTypes.object.isRequired
};

const BoardDetails = ({
  intl,
  board,
  actions,
  busy,
  communicator,
  activeBoardId,
  headingRef
}) => {
  const classes = useStyles();

  if (!board) {
    return (
      <div className={classes.empty}>
        <Typography variant="body2">
          {intl.formatMessage(messages.selectBoardPrompt)}
        </Typography>
      </div>
    );
  }

  const title = board.name || board.id;
  const locale = formatBoardLocale(intl, board.locale);
  const metaParts = [
    intl.formatMessage(messages.tilesQty, { qty: board.tiles.length }),
    locale,
    moment(board.lastEdited).format('DD/MM/YYYY')
  ].filter(Boolean);

  return (
    <div className={classes.root}>
      <BoardThumb board={board} className={classes.thumb} />

      <div>
        <Typography
          variant="h6"
          component="h2"
          className={classes.title}
          tabIndex={-1}
          ref={headingRef}
        >
          {title}
        </Typography>
        <Typography variant="caption" component="p" className={classes.meta}>
          {metaParts.join('  ·  ')}
        </Typography>
        {communicator && (
          <BoardStatusIcons
            intl={intl}
            board={board}
            communicator={communicator}
            activeBoardId={activeBoardId}
          />
        )}
      </div>

      <Divider />

      <div className={classes.actions}>
        {actions.map(action => (
          <ActionButton
            key={action.key}
            action={action}
            busy={busy}
            classes={classes}
          />
        ))}
      </div>
    </div>
  );
};

BoardDetails.defaultProps = {
  actions: [],
  busy: false
};

BoardDetails.propTypes = {
  intl: intlShape.isRequired,
  board: PropTypes.object,
  actions: PropTypes.array,
  busy: PropTypes.bool,
  communicator: PropTypes.object,
  activeBoardId: PropTypes.string,
  headingRef: PropTypes.object
};

export default BoardDetails;
