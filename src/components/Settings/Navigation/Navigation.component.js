import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import FullScreenDialog from '../../UI/FullScreenDialog';
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
      ...props.navigationSettings
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

  toggleRemoveOutput = () => {
    this.setState({
      removeOutputActive: !this.state.removeOutputActive
    });
  };

  onSubmit = () => {
    this.props.updateNavigationSettings(this.state);
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
                  primary={<FormattedMessage {...messages.enable} />}
                  secondary={<FormattedMessage {...messages.enableSecondary} />}
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={this.state.caBackButtonActive}
                    onChange={this.toggleCABackButton}
                    value="active"
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
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
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem disabled={true}>
                <ListItemText
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
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </FullScreenDialog>
      </div>
    );
  }
}

Navigation.propTypes = propTypes;

export default Navigation;
