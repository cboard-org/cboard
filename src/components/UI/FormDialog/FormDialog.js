import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import messages from './FormDialog.messages';

import './FormDialog.css';

FormDialog.propTypes = {
  disableSubmit: PropTypes.bool,
  open: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  classes: PropTypes.string,
  className: PropTypes.string,
  fullScreen: PropTypes.bool,
  children: PropTypes.node
};

FormDialog.defaultProps = {
  classes: '',
  onClose: () => {}
};

function FormDialog(props) {
  const {
    classes,
    children,
    open,
    title,
    description,
    disableSubmit,
    onClose,
    onSubmit,
    fullScreen
  } = props;

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      className={`FormDialog__Container ${classes}`}
    >
      <DialogTitle className="FormDialog__Title">{title}</DialogTitle>
      <DialogContent className="FormDialog__Content">
        {!!description && <DialogContentText>{description}</DialogContentText>}
        <div className="FormDialog__Children">{children}</div>
      </DialogContent>
      <DialogActions className="FormDialog__Actions">
        <Button onClick={onClose} color="primary">
          <FormattedMessage {...messages.cancel} />
        </Button>
        <Button
          onClick={onSubmit}
          color="primary"
          variant="contained"
          autoFocus
          disabled={disableSubmit}
        >
          <FormattedMessage {...messages.save} />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withMobileDialog()(FormDialog);
