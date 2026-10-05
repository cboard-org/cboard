import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

import { getBoardStatusItems } from './boardStatusItems';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.5)
  },
  icon: {
    fontSize: '1.3rem'
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

  const items = getBoardStatusItems(intl, {
    isPublic: board.isPublic,
    isRoot,
    isActive
  });
  const tones = {
    public: classes.public,
    private: classes.private,
    root: classes.root_,
    active: classes.active
  };

  return (
    <span className={classes.root}>
      {items.map((item) => (
        <Tooltip
          key={item.key}
          title={item.title}
          name="CommunicatorDialog__PropertyOption"
        >
          {React.cloneElement(item.icon, {
            className: `${classes.icon} ${tones[item.tone]}`,
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
