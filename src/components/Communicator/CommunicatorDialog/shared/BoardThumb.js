import React from 'react';
import PropTypes from 'prop-types';
import { alpha, makeStyles } from '@material-ui/core/styles';
import ViewModuleIcon from '@material-ui/icons/ViewModule';

import { isCordova } from '../../../../cordova-util';

const useStyles = makeStyles((theme) => {
  const dark = theme.palette.type === 'dark';
  return {
    root: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // Subtle diagonal wash so empty/short thumbnails still feel intentional.
      background: dark
        ? `linear-gradient(135deg, ${alpha(
            theme.palette.common.white,
            0.06
          )} 0%, ${alpha(theme.palette.common.white, 0.02)} 100%)`
        : `linear-gradient(135deg, ${theme.palette.grey[100]} 0%, ${
            theme.palette.grey[200]
          } 100%)`,
      overflow: 'hidden'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    },
    placeholder: {
      fontSize: '2.75rem',
      color: alpha(theme.palette.text.primary, dark ? 0.26 : 0.22)
    }
  };
});

const resolveCaption = (caption) => {
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
