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
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Scanning.messages';
import {
  SCANNING_METHOD_AUTOMATIC,
  SCANNING_METHOD_MANUAL
} from './Scanning.constants';

import './Scanning.css';

const propTypes = {
  /**
   * Callback fired when clicking the back button
   */
  onClose: PropTypes.func,
  updateScannerSettings: PropTypes.func
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
      ...props.scanningSettings
    };
  }

  toggleScanner = () => {
    this.setState({
      active: !this.state.active
    });
  };

  changeSelect = property => event => {
    this.setState({
      [property]: event.target.value
    });
  };

  onSubmit = () => {
    this.props.updateScannerSettings(this.state);
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
          </Paper>
        </FullScreenDialog>
      </div>
    );
  }
}

Scanning.propTypes = propTypes;

export default Scanning;
