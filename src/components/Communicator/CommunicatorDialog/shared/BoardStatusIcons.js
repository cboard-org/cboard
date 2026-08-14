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

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.5)
  },
  icon: {
    fontSize: '1.1rem'
  },
  // Semantic colors so each status reads on its own instead of a uniform green.
  public: {
    color: theme.palette.success?.main || '#369b00'
  },
  private: {
    color: theme.palette.text.secondary
  },
  root_: {
    color: theme.palette.primary.main
  },
  active: {
    color: theme.palette.secondary?.main || theme.palette.primary.main
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
      icon: board.isPublic ? <PublicIcon /> : <KeyIcon />,
      colorClass: board.isPublic ? classes.public : classes.private
    }
  ];
  if (isRoot) {
    items.push({
      key: 'root',
      title: intl.formatMessage(messages.rootBoard),
      icon: <HomeIcon />,
      colorClass: classes.root_
    });
  }
  if (isActive) {
    items.push({
      key: 'active',
      title: intl.formatMessage(messages.activeBoard),
      icon: <RemoveRedEyeIcon />,
      colorClass: classes.active
    });
  }

  return (
    <span className={classes.root}>
      {items.map((item) => (
        <Tooltip
          key={item.key}
          title={item.title}
          name="CommunicatorDialog__PropertyOption"
        >
          {React.cloneElement(item.icon, {
            className: `${classes.icon} ${item.colorClass}`,
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
