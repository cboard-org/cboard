import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import HomeIcon from '@material-ui/icons/Home';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

import BoardThumb from '../shared/BoardThumb';
import BoardStatusChips from '../shared/BoardStatusChips';
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
    padding: theme.spacing(1),
    borderRadius: softRadius(theme),
    ...surfaceInteractive(theme),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(1, 1.5)
    }
  },
  accent: surfaceAccent(theme),
  position: {
    flexShrink: 0,
    width: 16,
    textAlign: 'center',
    fontWeight: 600,
    color: theme.palette.text.disabled
  },
  thumb: {
    width: 48,
    height: 48,
    flexShrink: 0,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.up('sm')]: {
      width: 56,
      height: 56
    }
  },
  main: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5)
  },
  title: {
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  controls: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5)
  },
  control: {
    minWidth: 44,
    minHeight: 44
  },
  separator: {
    height: 24,
    margin: theme.spacing(0, 0.5)
  },
  busy: busyOverlay(theme)
}));

const QuickAccessRow = ({
  intl,
  board,
  position,
  isRoot,
  isActive,
  isFirst,
  isLast,
  hasAuth,
  busy,
  onSetRoot,
  onRemove,
  onMoveUp,
  onMoveDown
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down('xs'));
  const [menuAnchor, setMenuAnchor] = useState(null);
  const title = board.name || board.id;
  const t = (msg) => intl.formatMessage(msg);

  const actions = [
    {
      key: 'move-up',
      label: t(messages.moveUp),
      icon: <ArrowUpwardIcon />,
      disabled: isFirst,
      onClick: onMoveUp
    },
    {
      key: 'move-down',
      label: t(messages.moveDown),
      icon: <ArrowDownwardIcon />,
      disabled: isLast,
      onClick: onMoveDown
    },
    {
      key: 'set-root',
      label: t(messages.menuRootBoardOption),
      icon: <HomeIcon />,
      disabled: isRoot || !hasAuth,
      onClick: onSetRoot,
      startsGroup: true
    },
    {
      key: 'remove',
      label: t(messages.removeFromQuickAccess),
      icon: <RemoveCircleOutlineIcon />,
      disabled: isRoot,
      onClick: onRemove
    }
  ];

  const closeMenu = () => setMenuAnchor(null);

  const runFromMenu = (action) => () => {
    closeMenu();
    action.onClick();
  };

  return (
    <Paper
      variant="outlined"
      data-testid="quick-access-row"
      className={classNames(classes.row, { [classes.accent]: isRoot })}
    >
      {busy && (
        <div className={classes.busy}>
          <CircularProgress size={24} />
        </div>
      )}

      <Typography variant="body2" component="span" className={classes.position}>
        {position}
      </Typography>

      <BoardThumb board={board} className={classes.thumb} />

      <div className={classes.main}>
        <Typography className={classes.title} title={title}>
          {title}
        </Typography>
        <BoardStatusChips
          intl={intl}
          board={board}
          isRoot={isRoot}
          isActive={isActive}
          showVisibility={false}
        />
      </div>

      {isNarrow ? (
        <div className={classes.controls}>
          <IconButton
            size="small"
            data-testid="row-menu"
            className={classes.control}
            aria-label={`${t(messages.boardOptions)}: ${title}`}
            aria-haspopup="true"
            onClick={(event) => setMenuAnchor(event.currentTarget)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={closeMenu}>
            {actions.reduce((items, action) => {
              if (action.startsGroup) {
                items.push(<Divider key={`${action.key}-divider`} />);
              }
              items.push(
                <MenuItem
                  key={action.key}
                  data-testid={`menu-${action.key}`}
                  disabled={action.disabled}
                  onClick={runFromMenu(action)}
                >
                  <ListItemIcon>{action.icon}</ListItemIcon>
                  <ListItemText primary={action.label} />
                </MenuItem>
              );
              return items;
            }, [])}
          </Menu>
        </div>
      ) : (
        <div className={classes.controls}>
          {actions.map((action) => (
            <React.Fragment key={action.key}>
              {action.startsGroup && (
                <Divider orientation="vertical" className={classes.separator} />
              )}
              <Tooltip title={action.label}>
                <span>
                  <IconButton
                    size="small"
                    data-testid={action.key}
                    className={classes.control}
                    aria-label={`${action.label}: ${title}`}
                    disabled={action.disabled}
                    onClick={action.onClick}
                  >
                    {action.icon}
                  </IconButton>
                </span>
              </Tooltip>
            </React.Fragment>
          ))}
        </div>
      )}
    </Paper>
  );
};

QuickAccessRow.propTypes = {
  intl: intlShape.isRequired,
  board: PropTypes.object.isRequired,
  position: PropTypes.number.isRequired,
  isRoot: PropTypes.bool,
  isActive: PropTypes.bool,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool,
  hasAuth: PropTypes.bool,
  busy: PropTypes.bool,
  onSetRoot: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired
};

export default QuickAccessRow;
