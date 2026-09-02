import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Scanning.messages';
import {
  SCANNING_METHOD_AUTOMATIC,
  SCANNING_METHOD_MANUAL,
  EYE_CONTROL_DWELL_OPTIONS,
  EYE_CONTROL_SENSITIVITY_OPTIONS
} from './Scanning.constants';

import './Scanning.css';

const propTypes = {
  /**
   * Callback fired when clicking the back button
   */
  onClose: PropTypes.func,
  updateScannerSettings: PropTypes.func,
  updateGazeSwitchSettings: PropTypes.func,
  gazeSwitchSettings: PropTypes.object
};

const SCANNER_MESSAGES_KEYMAP = {
  [SCANNING_METHOD_MANUAL]: messages.scannerManualStrategy,
  [SCANNING_METHOD_AUTOMATIC]: messages.scannerAutomaticStrategy
};

const DELAY_OPTIONS = [
  {
    value: 750,
    label: 0.75
  },
  {
    value: 1000,
    label: 1
  },
  {
    value: 2000,
    label: 2
  },
  {
    value: 3000,
    label: 3
  },
  {
    value: 5000,
    label: 5
  }
];

class Scanning extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props.scanningSettings,
      gaze: { ...props.gazeSwitchSettings }
    };
  }

  toggleScanner = () => {
    this.setState((prevState) => {
      const active = !prevState.active;
      // Eye control (and its preview) depend on scanning being enabled.
      const gaze = active
        ? prevState.gaze
        : { ...prevState.gaze, active: false, showPreview: false };
      return { active, gaze };
    });
  };

  changeSelect = (property) => (event) => {
    this.setState({
      [property]: event.target.value
    });
  };

  toggleGaze = (property) => () => {
    this.setState((prevState) => {
      const gaze = { ...prevState.gaze, [property]: !prevState.gaze[property] };
      // Camera preview only applies while blink selection is enabled.
      if (property === 'active' && !gaze.active) {
        gaze.showPreview = false;
      }
      return { gaze };
    });
  };

  changeGazeSelect = (property) => (event) => {
    const { value } = event.target;
    this.setState((prevState) => ({
      gaze: { ...prevState.gaze, [property]: value }
    }));
  };

  onSubmit = () => {
    const { gaze, ...scanningSettings } = this.state;
    this.props.updateScannerSettings(scanningSettings);
    if (this.props.updateGazeSwitchSettings) {
      this.props.updateGazeSwitchSettings(gaze);
    }
  };

  render() {
    const { onClose } = this.props;
    return (
      <div className="Scanning">
        <FullScreenDialog
          open
          title={<FormattedMessage {...messages.scanning} />}
          onClose={onClose}
          onSubmit={this.onSubmit}
        >
          <Paper>
            <List>
              <ListItem>
                <ListItemText
                  className="Scanning__ListItemText"
                  primary={<FormattedMessage {...messages.enable} />}
                  secondary={<FormattedMessage {...messages.enableSecondary} />}
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={this.state.active}
                    onChange={this.toggleScanner}
                    value="active"
                    color="secondary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  className="Scanning__ListItemText"
                  primary={<FormattedMessage {...messages.delay} />}
                  secondary={<FormattedMessage {...messages.delaySecondary} />}
                />
                <ListItemSecondaryAction>
                  <Select
                    value={this.state.delay}
                    onChange={this.changeSelect('delay')}
                    inputProps={{
                      name: 'delay',
                      id: 'scanning-delay'
                    }}
                  >
                    {DELAY_OPTIONS.map(({ value, label }, i) => (
                      <MenuItem key={i} value={value}>
                        <FormattedMessage
                          {...messages.seconds}
                          values={{ value: label }}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  className="Scanning__ListItemText"
                  primary={<FormattedMessage {...messages.method} />}
                  secondary={<FormattedMessage {...messages.methodSecondary} />}
                />
                <ListItemSecondaryAction>
                  <Select
                    value={this.state.strategy}
                    onChange={this.changeSelect('strategy')}
                    inputProps={{
                      name: 'strategy',
                      id: 'scanning-strategy'
                    }}
                  >
                    <MenuItem value={SCANNING_METHOD_AUTOMATIC}>
                      <FormattedMessage {...messages.automatic} />
                    </MenuItem>
                    <MenuItem value={SCANNING_METHOD_MANUAL}>
                      <FormattedMessage {...messages.manual} />
                    </MenuItem>
                  </Select>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            <div className="Scanning__HelpText">
              <div>
                <FormattedMessage
                  {...SCANNER_MESSAGES_KEYMAP[this.state.strategy]}
                />
              </div>
              <div>
                <FormattedMessage {...messages.scannerHowToDeactivate} />
              </div>
            </div>

            <List
              subheader={
                <ListSubheader disableSticky>
                  <FormattedMessage {...messages.eyeControl} />
                </ListSubheader>
              }
            >
              <ListItem>
                <ListItemText
                  className="Scanning__ListItemText"
                  primary={<FormattedMessage {...messages.eyeControlEnable} />}
                  secondary={
                    <FormattedMessage
                      {...(this.state.active
                        ? messages.eyeControlEnableSecondary
                        : messages.eyeControlRequiresScanning)}
                    />
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={!!this.state.gaze.active}
                    onChange={this.toggleGaze('active')}
                    disabled={!this.state.active}
                    value="eyeControlActive"
                    color="secondary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  className="Scanning__ListItemText"
                  primary={<FormattedMessage {...messages.eyeControlDwell} />}
                  secondary={
                    <FormattedMessage {...messages.eyeControlDwellSecondary} />
                  }
                />
                <ListItemSecondaryAction>
                  <Select
                    value={this.state.gaze.dwellMs}
                    onChange={this.changeGazeSelect('dwellMs')}
                    disabled={!this.state.gaze.active}
                    inputProps={{
                      name: 'dwellMs',
                      id: 'eye-control-dwell'
                    }}
                  >
                    {EYE_CONTROL_DWELL_OPTIONS.map((value) => (
                      <MenuItem key={value} value={value}>
                        <FormattedMessage
                          {...messages.eyeControlMilliseconds}
                          values={{ value }}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  className="Scanning__ListItemText"
                  primary={
                    <FormattedMessage {...messages.eyeControlSensitivity} />
                  }
                  secondary={
                    <FormattedMessage
                      {...messages.eyeControlSensitivitySecondary}
                    />
                  }
                />
                <ListItemSecondaryAction>
                  <Select
                    value={this.state.gaze.blinkThreshold}
                    onChange={this.changeGazeSelect('blinkThreshold')}
                    disabled={!this.state.gaze.active}
                    inputProps={{
                      name: 'blinkThreshold',
                      id: 'eye-control-sensitivity'
                    }}
                  >
                    {EYE_CONTROL_SENSITIVITY_OPTIONS.map(({ value, label }) => (
                      <MenuItem key={value} value={value}>
                        <FormattedMessage {...messages[label]} />
                      </MenuItem>
                    ))}
                  </Select>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  className="Scanning__ListItemText"
                  primary={
                    <FormattedMessage {...messages.eyeControlShowPreview} />
                  }
                  secondary={
                    <FormattedMessage
                      {...messages.eyeControlShowPreviewSecondary}
                    />
                  }
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={!!this.state.gaze.showPreview}
                    onChange={this.toggleGaze('showPreview')}
                    disabled={!this.state.gaze.active}
                    value="eyeControlShowPreview"
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

Scanning.propTypes = propTypes;

export default Scanning;
