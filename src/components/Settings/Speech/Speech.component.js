import React from 'react';
import { FormattedMessage } from 'react-intl';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';
import { LinearProgress } from 'material-ui/Progress';
import ArrowDownwardIcon from 'material-ui-icons/ArrowDownward';
import ArrowUpwardIcon from 'material-ui-icons/ArrowUpward';
import FastForwardIcon from 'material-ui-icons/FastForward';
import FastRewindIcon from 'material-ui-icons/FastRewind';

import FullScreenDialog from '../../FullScreenDialog';
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
    justifyContent: 'center'
  },
  icon: {
    marginLeft: 3,
    marginRight: 3,
    width: 20
  },
  progress: {
    paddingLeft: 2,
    paddingRight: 2,
    maxWidth: '50%',
    minWidth: '20%',
    marginTop: 20
  }
});

const getProgressPercent = (value, min, max) =>
  Math.round((value - min) / (max - min) * 100.0);

const SpeechComponent = ({
  anchorEl,
  classes,
  handleChangePitch,
  handleChangeRate,
  handleClickListItem,
  handleMenuItemClick,
  handleVoiceRequestClose,
  intl,
  langVoices,
  onRequestClose,
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
      onRequestClose={onRequestClose}
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
              <Button
                color="primary"
                aria-label={intl.formatMessage(messages.lower)}
                disabled={pitch <= MIN_PITCH}
                onClick={() => handleChangePitch(pitch - INCREMENT_PITCH)}
              >
                <ArrowDownwardIcon className={classes.icon} />
              </Button>
              <div className={classes.progress}>
                <LinearProgress
                  variant="determinate"
                  value={getProgressPercent(pitch, MIN_PITCH, MAX_PITCH)}
                />
              </div>
              <Button
                color="primary"
                aria-label={intl.formatMessage(messages.higher)}
                disabled={pitch >= MAX_PITCH}
                onClick={() => handleChangePitch(pitch + INCREMENT_PITCH)}
              >
                <ArrowUpwardIcon className={classes.icon} />
              </Button>
            </div>
          </ListItem>
          <ListItem aria-label={intl.formatMessage(messages.rate)}>
            <ListItemText
              primary={<FormattedMessage {...messages.rate} />}
              secondary={<FormattedMessage {...messages.rateDescription} />}
            />
            <div className={classes.container}>
              <Button
                color="primary"
                aria-label={intl.formatMessage(messages.slower)}
                disabled={rate <= MIN_RATE}
                onClick={() => handleChangeRate(rate - INCREMENT_RATE)}
              >
                <FastRewindIcon className={classes.icon} />
              </Button>
              <div className={classes.progress}>
                <LinearProgress
                  variant="determinate"
                  value={getProgressPercent(rate, MIN_RATE, MAX_RATE)}
                />
              </div>
              <Button
                color="primary"
                aria-label={intl.formatMessage(messages.faster)}
                disabled={rate >= MAX_RATE}
                onClick={() => handleChangeRate(rate + INCREMENT_RATE)}
              >
                <FastForwardIcon className={classes.icon} />
              </Button>
            </div>
          </ListItem>
        </List>
      </Paper>
      <Menu
        id="voice-menu"
        anchorEl={anchorEl}
        open={voiceOpen}
        onClose={handleVoiceRequestClose}
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

export default withStyles(styles)(SpeechComponent);
