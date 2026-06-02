import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ViewModuleIcon from '@material-ui/icons/ViewModule';

import { isCordova } from '../../../../cordova-util';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      theme.palette.type === 'dark'
        ? 'rgba(255,255,255,0.06)'
        : theme.palette.grey[100],
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  placeholder: {
    fontSize: '3rem',
    color: theme.palette.action.disabled
  }
}));

const resolveCaption = caption => {
  if (isCordova() && caption && caption.search('/') === 0) {
    return `.${caption}`;
  }
  return caption;
};

const BoardThumb = ({ board, className }) => {
  const classes = useStyles();
  const caption = resolveCaption(board.caption);

  return (
    <div className={`${classes.root} ${className || ''}`}>
      {caption ? (
        <img className={classes.image} src={caption} alt={board.name || ''} />
      ) : (
        <ViewModuleIcon className={classes.placeholder} />
      )}
    </div>
  );
};

BoardThumb.propTypes = {
  board: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default BoardThumb;
