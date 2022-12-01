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
import messages from './Navigation.messages';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { NAVIGATION_BUTTONS_STYLES } from './Navigation.constants';

import './Navigation.css';
import ResetToursItem from '../../UI/ResetToursItem';

const propTypes = {
  /**
   * Callback fired when clicking the back button
   */
  onClose: PropTypes.func,
  updateNavigationSettings: PropTypes.func.isRequired,
  navigationSettings: PropTypes.object.isRequired,
  isLiveMode: PropTypes.bool,
  changeLiveMode: PropTypes.func.isRequired
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

  toggleCAScrollButton = () => {
    this.setState({
      bigScrollButtonsActive: !this.state.bigScrollButtonsActive
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

  toggleLiveMode = () => {
    this.setState({
      liveMode: !this.state.liveMode
    });
  };

  onSubmit = () => {
    const { isLiveMode, changeLiveMode } = this.props;
    if (!this.state.liveMode && isLiveMode) {
      changeLiveMode();
    }
    this.props.updateNavigationSettings(this.state);
  };

  onNavigationSettingsChange(navigationSetting, event) {
    const {
      target: { value }
    } = event;
    this.setState({ [navigationSetting]: value });
  }

  renderNavigationButtonsLocationSelect() {
    const name = 'navigationButtonsStyle';
    const actualButtonsStyle = NAVIGATION_BUTTONS_STYLES.filter(
      style => style.value === this.state[name]
    )[0];

    return (
      <FormControl>
        <Select
          aria-label={name}
          id={name}
          name={name}
          value={
            actualButtonsStyle?.value || NAVIGATION_BUTTONS_STYLES[0].value
          }
          onChange={e => this.onNavigationSettingsChange(name, e)}
          disabled={
            !(
              this.state.bigScrollButtonsActive || this.state.caBackButtonActive
            )
          }
        >
          {NAVIGATION_BUTTONS_STYLES.map(style => (
            <MenuItem key={style?.value} value={style?.value}>
              {style?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

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
                  className="Navigation__ListItemText"
                  primary={<FormattedMessage {...messages.bigScroll} />}
                  secondary={
                    <FormattedMessage {...messages.bigScrollSecondary} />
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={this.state.bigScrollButtonsActive}
                    onChange={this.toggleCAScrollButton}
                    value="active"
                    color="secondary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem
                disabled={
                  !(
                    this.state.bigScrollButtonsActive ||
                    this.state.caBackButtonActive
                  )
                }
              >
                <ListItemText
                  className="Display__ListItemText"
                  primary={
                    <FormattedMessage {...messages.navigationButtonsStyle} />
                  }
                  secondary={
                    <FormattedMessage
                      {...messages.navigationButtonsStyleSecondary}
                    />
                  }
                />
                <ListItemSecondaryAction className="Display__Options">
                  {this.renderNavigationButtonsLocationSelect()}
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
              <ResetToursItem />
              <Divider />
              <ListItem>
                <ListItemText
                  className="Display__ListItemText"
                  primary={<FormattedMessage {...messages.showLiveMode} />}
                  secondary={
                    <FormattedMessage {...messages.showLiveModeSecondary} />
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={this.state.liveMode || false}
                    onChange={this.toggleLiveMode}
                    value="active"
                    color="secondary"
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
