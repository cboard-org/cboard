import React from 'react';
import PropTypes from 'prop-types';
import { alpha, makeStyles } from '@material-ui/core/styles';
import ViewModuleIcon from '@material-ui/icons/ViewModule';

import { isCordova } from '../../../cordova-util';

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

const resolveSrc = (src) => {
  if (isCordova() && src && src.search('/') === 0) {
    return `.${src}`;
  }
  return src;
};

/**
 * Thumbnail slot for a dashboard item: `children` (e.g. a generated QR code)
 * take precedence over `src`; with neither, the placeholder icon is shown.
 */
const ItemThumb = ({ src, alt, icon: Icon, children, className }) => {
  const classes = useStyles();
  const resolvedSrc = resolveSrc(src);

  let content = <Icon className={classes.placeholder} />;
  if (children) {
    content = children;
  } else if (resolvedSrc) {
    content = <img className={classes.image} src={resolvedSrc} alt={alt} />;
  }

  return <div className={`${classes.root} ${className || ''}`}>{content}</div>;
};

ItemThumb.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  icon: PropTypes.elementType,
  children: PropTypes.node,
  className: PropTypes.string
};

ItemThumb.defaultProps = {
  alt: '',
  icon: ViewModuleIcon
};

export default ItemThumb;
