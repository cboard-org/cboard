import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Display.messages';

import './Display.css';
import {
  DISPLAY_SIZE_STANDARD,
  DISPLAY_SIZE_LARGE,
  DISPLAY_SIZE_EXTRALARGE
} from './Display.constants';

class Display extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props.displaySettings
    };
  }

  onDisplaySettingsChange(displaySetting, event) {
    const {
      target: { value }
    } = event;
    this.setState({ [displaySetting]: value });
  }

  renderRadioGroup(name) {
    return (
      <RadioGroup
        aria-label={this.props.intl.formatMessage(messages[name])}
        name={name}
        className="Display__Options__Row"
        value={this.state[name]}
        onChange={e => this.onDisplaySettingsChange(name, e)}
      >
        <FormControlLabel
          control={<Radio />}
          label={this.props.intl.formatMessage(messages[DISPLAY_SIZE_STANDARD])}
          value={DISPLAY_SIZE_STANDARD}
          labelPlacement="start"
        />
        <FormControlLabel
          control={<Radio />}
          label={this.props.intl.formatMessage(messages[DISPLAY_SIZE_LARGE])}
          value={DISPLAY_SIZE_LARGE}
          labelPlacement="start"
        />
        <FormControlLabel
          control={<Radio />}
          label={this.props.intl.formatMessage(
            messages[DISPLAY_SIZE_EXTRALARGE]
          )}
          value={DISPLAY_SIZE_EXTRALARGE}
          labelPlacement="start"
        />
      </RadioGroup>
    );
  }

  onSubmit() {
    this.props.updateDisplaySettings(this.state);
  }

  render() {
    const { onClose } = this.props;
    return (
      <FullScreenDialog
        open
        title={<FormattedMessage {...messages.display} />}
        onClose={onClose}
        onSubmit={this.onSubmit.bind(this)}
      >
        <Paper className="Display">
          <List>
            <ListItem>
              <ListItemText
                primary={<FormattedMessage {...messages.uiSize} />}
                secondary={<FormattedMessage {...messages.uiSizeSecondary} />}
              />
              <ListItemSecondaryAction className="Display__Options">
                {this.renderRadioGroup('uiSize')}
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText
                primary={<FormattedMessage {...messages.fontSize} />}
                secondary={<FormattedMessage {...messages.fontSizeSecondary} />}
              />
              <ListItemSecondaryAction className="Display__Options">
                {this.renderRadioGroup('fontSize')}
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>
      </FullScreenDialog>
    );
  }
}

Display.propTypes = {
  displaySettings: PropTypes.object.isRequired
};

export default Display;
