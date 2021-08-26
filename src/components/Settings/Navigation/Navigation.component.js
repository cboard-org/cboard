import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import FullScreenDialog from '../../UI/FullScreenDialog';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import messages from './Navigation.messages';

import './Navigation.css';

const propTypes = {
  /**
   * Callback fired when clicking the back button
   */
  onClose: PropTypes.func,
  updateNavigationSettings: PropTypes.func.isRequired,
  navigationSettings: PropTypes.object.isRequired
};

class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props.navigationSettings,
      openDialogToursState: false
    };
  }

  toggleCABackButton = () => {
    this.setState({
      caBackButtonActive: !this.state.caBackButtonActive
    });
  };

  toggleQuickUnlock = () => {
    this.setState({
      quickUnlockActive: !this.state.quickUnlockActive
    });
  };

  toggleShareShow = () => {
    this.setState({
      shareShowActive: !this.state.shareShowActive
    });
  };

  toggleRemoveOutput = () => {
    this.setState({
      removeOutputActive: !this.state.removeOutputActive
    });
  };

  toggleVocalizeFolders = () => {
    this.setState({
      vocalizeFolders: !this.state.vocalizeFolders
    });
  };

  onSubmit = () => {
    let navigationSettings = Object.assign({}, this.state);
    delete navigationSettings.openDialogToursState;
    this.props.updateNavigationSettings(navigationSettings);
  };

  handleOnClickOk = () => {
    this.props.enableAllTours();
    this.handleClose();
  };

  handleClickOpen = () => {
    this.setState({ openDialogToursState: true });
  };

  handleClose = () => {
    this.setState({ openDialogToursState: false });
  };

  render() {
    const { onClose } = this.props;
    return (
      <div className="Navigation">
        <FullScreenDialog
          open
          title={<FormattedMessage {...messages.navigation} />}
          onClose={onClose}
          onSubmit={this.onSubmit}
        >
          <Paper>
            <List>
              <ListItem>
                <ListItemText
                  className="Navigation__ListItemText"
                  primary={<FormattedMessage {...messages.enable} />}
                  secondary={<FormattedMessage {...messages.enableSecondary} />}
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={this.state.caBackButtonActive}
                    onChange={this.toggleCABackButton}
                    value="active"
                    color="secondary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  className="Display__ListItemText"
                  primary={<FormattedMessage {...messages.shareShow} />}
                  secondary={
                    <FormattedMessage {...messages.shareShowSecondary} />
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={this.state.shareShowActive}
                    onChange={this.toggleShareShow}
                    value="active"
                    color="secondary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  className="Navigation__ListItemText"
                  primary={<FormattedMessage {...messages.outputRemove} />}
                  secondary={
                    <FormattedMessage {...messages.outputRemoveSecondary} />
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={this.state.removeOutputActive}
                    onChange={this.toggleRemoveOutput}
                    value="active"
                    color="secondary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem disabled={true}>
                <ListItemText
                  className="Navigation__ListItemText"
                  primary={<FormattedMessage {...messages.quickUnlock} />}
                  secondary={
                    <FormattedMessage {...messages.quickUnlockSecondary} />
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    disabled={true}
                    checked={this.state.quickUnlockActive}
                    onChange={this.toggleQuickUnlock}
                    value="active"
                    color="secondary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  className="Navigation__ListItemText"
                  primary={<FormattedMessage {...messages.vocalizeFolders} />}
                  secondary={
                    <FormattedMessage {...messages.vocalizeFoldersSecondary} />
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={this.state.vocalizeFolders}
                    onChange={this.toggleVocalizeFolders}
                    value="active"
                    color="secondary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem button={true} onClick={this.handleClickOpen}>
                <ListItemText
                  className="Navigation__ListItemText"
                  primary={<FormattedMessage {...messages.resetTours} />}
                  secondary={
                    <FormattedMessage {...messages.resetToursSecondary} />
                  }
                />
              </ListItem>
              <Dialog
                open={this.state.openDialogToursState}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  <FormattedMessage {...messages.confirmDialog} />
                </DialogTitle>
                <DialogActions>
                  <Button onClick={this.handleOnClickOk} color="primary">
                    <FormattedMessage {...messages.ok} />
                  </Button>
                  <Button onClick={this.handleClose} color="primary">
                    <FormattedMessage {...messages.cancel} />
                  </Button>
                </DialogActions>
              </Dialog>
            </List>
          </Paper>
        </FullScreenDialog>
      </div>
    );
  }
}

Navigation.propTypes = propTypes;

export default Navigation;
