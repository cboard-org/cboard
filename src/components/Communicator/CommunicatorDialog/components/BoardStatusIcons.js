import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import PublicIcon from '@material-ui/icons/Public';
import KeyIcon from '@material-ui/icons/VpnKey';
import HomeIcon from '@material-ui/icons/Home';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';

import messages from '../CommunicatorDialog.messages';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    color: theme.palette.success?.main || '#369b00'
  },
  icon: {
    fontSize: '1.1rem'
  }
}));

const BoardStatusIcons = ({ intl, board, communicator, activeBoardId }) => {
  const classes = useStyles();
  const isRoot = communicator.rootBoard === board.id;
  const isActive = activeBoardId === board.id;

  const items = [
    {
      key: 'visibility',
      title: board.isPublic
        ? intl.formatMessage(messages.publicBoard)
        : intl.formatMessage(messages.privateBoard),
      icon: board.isPublic ? <PublicIcon /> : <KeyIcon />
    }
  ];
  if (isRoot) {
    items.push({
      key: 'root',
      title: intl.formatMessage(messages.rootBoard),
      icon: <HomeIcon />
    });
  }
  if (isActive) {
    items.push({
      key: 'active',
      title: intl.formatMessage(messages.activeBoard),
      icon: <RemoveRedEyeIcon />
    });
  }

  return (
    <span className={classes.root}>
      {items.map(item => (
        <Tooltip
          key={item.key}
          title={item.title}
          name="CommunicatorDialog__PropertyOption"
        >
          {React.cloneElement(item.icon, {
            className: classes.icon,
            'aria-label': item.title
          })}
        </Tooltip>
      ))}
    </span>
  );
};

BoardStatusIcons.propTypes = {
  intl: intlShape.isRequired,
  board: PropTypes.object.isRequired,
  communicator: PropTypes.object.isRequired,
  activeBoardId: PropTypes.string
};

export default BoardStatusIcons;
