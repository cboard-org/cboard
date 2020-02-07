import React from 'react';
import { FormattedMessage } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Slider from '@material-ui/core/Slider';

import FullScreenDialog from '../../UI/FullScreenDialog';
import {
  MIN_PITCH,
  MAX_PITCH,
  INCREMENT_PITCH,
  MIN_RATE,
  MAX_RATE,
  INCREMENT_RATE
} from './Speech.constants';
import messages from './Speech.messages';

const styles = theme => ({
  container: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    width: '100%'
  }
});

const Speech = ({
  anchorEl,
  classes,
  handleChangePitch,
  handleChangeRate,
  handleClickListItem,
  handleMenuItemClick,
  handleVoiceClose,
  intl,
  langVoices,
  onClose,
  pitch,
  rate,
  selectedVoiceIndex,
  voiceOpen,
  voiceURI
}) => (
  <div className="Speech">
    <FullScreenDialog
      open
      title={<FormattedMessage {...messages.speech} />}
      onClose={onClose}
    >
      <Paper>
        <List>
          <ListItem
            button
            divider
            aria-haspopup="true"
            aria-controls="voice-menu"
            aria-label="Voice"
            onClick={handleClickListItem}
          >
            <ListItemText
              primary={<FormattedMessage {...messages.voice} />}
              secondary={voiceURI}
            />
          </ListItem>
          <ListItem divider aria-label={intl.formatMessage(messages.pitch)}>
            <ListItemText
              primary={<FormattedMessage {...messages.pitch} />}
              secondary={<FormattedMessage {...messages.pitchDescription} />}
            />
            <div className={classes.container}>
              <Slider
                value={pitch}
                min={MIN_PITCH}
                max={MAX_PITCH}
                step={INCREMENT_PITCH}
                onChange={handleChangePitch}
              />
            </div>
          </ListItem>
          <ListItem aria-label={intl.formatMessage(messages.rate)}>
            <ListItemText
              primary={<FormattedMessage {...messages.rate} />}
              secondary={<FormattedMessage {...messages.rateDescription} />}
            />
            <div className={classes.container}>
              <Slider
                value={rate}
                min={MIN_RATE}
                max={MAX_RATE}
                step={INCREMENT_RATE}
                onChange={handleChangeRate}
              />
            </div>
          </ListItem>
        </List>
      </Paper>
      <Menu
        id="voice-menu"
        anchorEl={anchorEl}
        open={voiceOpen}
        onClose={handleVoiceClose}
      >
        {langVoices.map((voice, index) => (
          <MenuItem
            key={index}
            selected={index === selectedVoiceIndex}
            onClick={() => handleMenuItemClick(voice, index)}
          >
            {voice.name}
          </MenuItem>
        ))}
      </Menu>
    </FullScreenDialog>
  </div>
);

export default withStyles(styles)(Speech);
