import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';

import messages from '../../App/App.messages';
import BackButton from '../BackButton';
import './FullScreenDialog.css';

FullScreenDialog.propTypes = {
  disableSubmit: PropTypes.bool,
  open: PropTypes.bool,
  fullWidth: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  children: PropTypes.node
};

FullScreenDialog.defaultProps = {
  onClose: () => {}
};

const styles = {
  appBar: {
    position: 'static',
    flexShrink: 0
  },
  title: {
    flex: 1,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  container: {
    background: '#f1f1f1',
    height: '100%',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch'
  },
  containerDark: {
    background: '#1111',
    height: '100%',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch'
  },
  content: {
    maxWidth: '680px',
    margin: '0 auto'
  },
  contentFullWidth: {
    margin: '0 auto'
  }
};

const transitions = {
  UP: 'up',
  FADE: 'fade'
};

const TransitionUp = React.forwardRef((props, ref) => (
  <Slide direction="up" {...props} ref={ref} />
));
const TransitionFade = React.forwardRef((props, ref) => (
  <Fade {...props} ref={ref} />
));

function getTransition(transition) {
  switch (transition) {
    case transitions.UP:
      return TransitionUp;
    case transitions.FADE:
      return TransitionFade;
    default:
    // no default
  }
}

function FullScreenDialog(props) {
  const {
    classes,
    children,
    open,
    title,
    buttons,
    disableSubmit,
    onClose,
    onSubmit,
    transition = transitions.UP,
    fullWidth
  } = props;

  const theme = useTheme();
  const dark = theme.palette.type === 'dark' ? true : false;

  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={getTransition(transition)}
      onClose={onClose}
    >
      <AppBar className={classes.appBar}>
        <Toolbar disableGutters>
          <BackButton onClick={onClose} />

          {title && (
            <div className="FullScreenDialog__title">
              <Typography
                variant="h6"
                color="inherit"
                className={classes.title}
              >
                {title}
              </Typography>
            </div>
          )}
          {buttons && (
            <div className="FullScreenDialog__buttons">{buttons}</div>
          )}
          {onSubmit && (
            <Button
              id="save-button"
              disabled={disableSubmit}
              color="inherit"
              style={{ color: disableSubmit && 'rgba(255, 255, 255, 0.26)' }}
              onClick={() => {
                onSubmit();
                onClose();
              }}
            >
              <FormattedMessage {...messages.save} />
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <div className={dark ? classes.containerDark : classes.container}>
        <div className={fullWidth ? classes.contentFullWidth : classes.content}>
          {children}
        </div>
      </div>
    </Dialog>
  );
}

export default withStyles(styles, { name: 'FullScreenDialog' })(
  FullScreenDialog
);
