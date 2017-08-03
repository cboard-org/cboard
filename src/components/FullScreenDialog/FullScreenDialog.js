import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog, { DialogContent } from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import Slide from 'material-ui/transitions/Slide';

import messages from '../../containers/App/messages';

const styleSheet = createStyleSheet('FullScreenDialog', {
  appBar: {
    position: 'static',
    flexShrink: 0
  },
  title: {
    flex: 1
  },
  content: {
    WebkitOverflowScrolling: 'touch'
  }
});

function FullScreenDialog(props) {
  const { open, title, onCancel, onSubmit, classes, children } = props;

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        transition={<Slide direction="up" />}
        onRequestClose={() => {
          onCancel();
        }}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <div className="back-button">
              <IconButton
                color="contrast"
                onClick={() => {
                  onCancel();
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </div>
            <Typography type="title" color="inherit" className={classes.title}>
              {title}
            </Typography>
            {onSubmit &&
              <Button
                color="contrast"
                onClick={() => {
                  onSubmit();
                  onCancel();
                }}
              >
                <FormattedMessage {...messages.save} />
              </Button>}
          </Toolbar>
        </AppBar>
        <DialogContent className={classes.content}>
          {children}
        </DialogContent>
      </Dialog>
    </div>
  );
}

FullScreenDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  children: PropTypes.node
};

FullScreenDialog.defaultProps = {
  onCancel: () => {}
};

export default withStyles(styleSheet)(FullScreenDialog);
