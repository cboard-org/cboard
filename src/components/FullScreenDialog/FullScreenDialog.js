import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import Slide from 'material-ui/transitions/Slide';

import messages from '../../containers/App/messages';

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
    height: '100%',
    background: '#f1f1f1',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch'
  },
  paper: {
    background: '#fff',
    maxWidth: '680px',
    margin: '0 auto'
  }
};

function FullScreenDialog(props) {
  const { disableSave, open, title, onCancel, onSubmit, classes, children } = props;
  return (
    <Dialog
      fullScreen
      open={open}
      transition={<Slide direction="up" />}
      onRequestClose={() => {
        onCancel();
      }}
    >
      <AppBar className={classes.appBar}>
        <Toolbar disableGutters>
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
          {onSubmit && (
            <Button
              disabled={disableSave}
              color="contrast"
              onClick={() => {
                onSubmit();
                onCancel();
              }}
            >
              <FormattedMessage {...messages.save} />
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <div className={classes.container}>
        <Paper className={classes.paper}>{children}</Paper>
      </div>
    </Dialog>
  );
}

FullScreenDialog.propTypes = {
  validInput: PropTypes.bool,
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

export default withStyles(styles, { name: 'FullScreenDialog' })(
  FullScreenDialog
);
