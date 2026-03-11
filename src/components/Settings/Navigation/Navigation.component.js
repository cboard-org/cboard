import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Navigation.messages';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { NAVIGATION_BUTTONS_STYLES } from './Navigation.constants';

import './Navigation.css';
import ResetToursItem from '../../UI/ResetToursItem';
import PremiumFeature from '../../PremiumFeature';

const propTypes = {
  /**
   * Callback fired when clicking the back button
   */
  onClose: PropTypes.func,
  updateNavigationSettings: PropTypes.func.isRequired,
  navigationSettings: PropTypes.object.isRequired,
  isLiveMode: PropTypes.bool,
  changeLiveMode: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props.navigationSettings,
      pinCodeVisible: false
    };
  }

  togglePinCodeVisibility = () => {
    this.setState(prevState => ({
      pinCodeVisible: !prevState.pinCodeVisible
    }));
  };

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

  togglePinLock = () => {
    this.setState(prevState => ({
      pinLockEnabled: !prevState.pinLockEnabled
    }));
  };

  handlePinCodeChange = event => {
    const value = event.target.value.replace(/\D/g, '').slice(0, 4);
    this.setState({ pinCode: value });
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

  toggleQuietBuilderMode = () => {
    this.setState({
      quietBuilderMode: !this.state.quietBuilderMode
    });
  };

  toggleLiveMode = () => {
    this.setState({
      liveMode: !this.state.liveMode
    });
  };

  toggleImprovePhraseActive = () => {
    this.setState({
      improvePhraseActive: !this.state.improvePhraseActive
    });
  };

  onSubmit = () => {
    const { isLiveMode, changeLiveMode } = this.props;
    if (!this.state.liveMode && isLiveMode) {
      changeLiveMode();
    }
    const { pinCodeVisible, ...navigationSettings } = this.state;
    this.props.updateNavigationSettings(navigationSettings);
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
              {<FormattedMessage {...messages[(style?.name)]} />}
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
              <ListItem disabled={false}>
                <ListItemText
                  className="Navigation__ListItemText"
                  primary={<FormattedMessage {...messages.quickUnlock} />}
                  secondary={
                    <FormattedMessage {...messages.quickUnlockSecondary} />
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    disabled={false}
                    checked={this.state.quickUnlockActive}
                    onChange={this.toggleQuickUnlock}
                    value="active"
                    color="secondary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem disabled={this.state.quickUnlockActive}>
                <ListItemText
                  className="Navigation__ListItemText"
                  primary={<FormattedMessage {...messages.pinLock} />}
                  secondary={
                    <FormattedMessage {...messages.pinLockSecondary} />
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    disabled={this.state.quickUnlockActive}
                    checked={this.state.pinLockEnabled || false}
                    onChange={this.togglePinLock}
                    value="active"
                    color="secondary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem
                disabled={
                  !this.state.pinLockEnabled || this.state.quickUnlockActive
                }
              >
                <ListItemText
                  className="Navigation__ListItemText"
                  primary={<FormattedMessage {...messages.pinCodeLabel} />}
                />
                <ListItemSecondaryAction>
                  <TextField
                    disabled={
                      !this.state.pinLockEnabled || this.state.quickUnlockActive
                    }
                    type={this.state.pinCodeVisible ? 'text' : 'password'}
                    inputProps={{
                      maxLength: 4,
                      pattern: '[0-9]*',
                      inputMode: 'numeric',
                      style: { textAlign: 'center', width: '80px' }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle pin visibility"
                            onClick={this.togglePinCodeVisibility}
                            edge="end"
                            size="small"
                            disabled={
                              !this.state.pinLockEnabled ||
                              this.state.quickUnlockActive
                            }
                          >
                            {this.state.pinCodeVisible ? (
                              <Visibility fontSize="small" />
                            ) : (
                              <VisibilityOff fontSize="small" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    value={this.state.pinCode || ''}
                    onChange={this.handlePinCodeChange}
                    error={
                      this.state.pinLockEnabled &&
                      this.state.pinCode?.length > 0 &&
                      this.state.pinCode?.length < 4
                    }
                    helperText={
                      this.state.pinLockEnabled &&
                      this.state.pinCode?.length > 0 &&
                      this.state.pinCode?.length < 4 ? (
                        <FormattedMessage {...messages.pinCodeError} />
                      ) : (
                        ''
                      )
                    }
                    placeholder="****"
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
              <ListItem>
                <ListItemText
                  className="Navigation__ListItemText"
                  primary={<FormattedMessage {...messages.quietBuilderMode} />}
                  secondary={
                    <FormattedMessage {...messages.quietBuilderModeSecondary} />
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={this.state.quietBuilderMode}
                    onChange={this.toggleQuietBuilderMode}
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
              <Divider />
              <ListItem>
                <ListItemText
                  className="Display__ListItemText"
                  primary={
                    <FormattedMessage {...messages.activeImprovePhrase} />
                  }
                  secondary={
                    <FormattedMessage
                      {...messages.activeImprovePhraseSecondary}
                    />
                  }
                />
                <ListItemSecondaryAction>
                  <PremiumFeature isLoginRequired={true}>
                    <Switch
                      checked={this.state.improvePhraseActive || false}
                      onChange={this.toggleImprovePhraseActive}
                      value="active"
                      color="secondary"
                    />
                  </PremiumFeature>
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

export default injectIntl(Navigation);
