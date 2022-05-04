import React from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Slider from '@material-ui/core/Slider';
import Chip from '@material-ui/core/Chip';

import FullScreenDialog from '../../UI/FullScreenDialog';
import { isCordova } from '../../../cordova-util';
import {
  MIN_PITCH,
  MAX_PITCH,
  INCREMENT_PITCH,
  MIN_RATE,
  MAX_RATE,
  INCREMENT_RATE
} from './Speech.constants';
import messages from './Speech.messages';
import './Speech.css';

const propTypes = {
  handleChangePitch: PropTypes.func,
  handleChangeRate: PropTypes.func,
  handleClickListItem: PropTypes.func,
  onMenuItemClick: PropTypes.func,
  handleVoiceClose: PropTypes.func,
  intl: intlShape.isRequired,
  langVoices: PropTypes.arrayOf(PropTypes.object),
  onClose: PropTypes.func,
  pitch: PropTypes.number,
  rate: PropTypes.number,
  selectedVoiceIndex: PropTypes.number,
  isVoiceOpen: PropTypes.bool.isRequired,
  voice: PropTypes.object.isRequired
};

const styles = theme => ({
  container: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    width: '100%'
  }
});

const getVoiceLabel = voice => {
  if (!voice) {
    return undefined;
  }
  if (voice.name === 'srpski Crna Gora') {
    return voice.voiceURI;
  }
  const isSerbianVoice = voice.lang?.startsWith('sr');
  return isCordova() && !isSerbianVoice
    ? voice.name + ' - ' + voice.voiceURI
    : voice.name;
};

const Speech = ({
  anchorEl,
  classes,
  handleChangePitch,
  handleChangeRate,
  handleClickListItem,
  onMenuItemClick,
  handleVoiceClose,
  intl,
  langVoices,
  onClose,
  pitch,
  rate,
  selectedVoiceIndex,
  isVoiceOpen,
  voice
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
              className="Speech__ListItemText"
              primary={<FormattedMessage {...messages.voice} />}
              secondary={getVoiceLabel(voice)}
            />
          </ListItem>
          <ListItem
            disabled={voice && voice.voiceSource === 'cloud' ? true : false}
            divider
            aria-label={intl.formatMessage(messages.pitch)}
          >
            <ListItemText
              primary={<FormattedMessage {...messages.pitch} />}
              secondary={<FormattedMessage {...messages.pitchDescription} />}
            />
            <div className={classes.container}>
              <Slider
                color="secondary"
                value={pitch}
                min={MIN_PITCH}
                max={MAX_PITCH}
                step={INCREMENT_PITCH}
                onChange={handleChangePitch}
                disabled={voice && voice.voiceSource === 'cloud' ? true : false}
              />
            </div>
          </ListItem>
          <ListItem
            disabled={voice && voice.voiceSource === 'cloud' ? true : false}
            aria-label={intl.formatMessage(messages.rate)}
          >
            <ListItemText
              className="Speech__ListItemText"
              primary={<FormattedMessage {...messages.rate} />}
              secondary={<FormattedMessage {...messages.rateDescription} />}
            />
            <div className={classes.container}>
              <Slider
                color="secondary"
                value={rate}
                min={MIN_RATE}
                max={MAX_RATE}
                step={INCREMENT_RATE}
                onChange={handleChangeRate}
                disabled={voice && voice.voiceSource === 'cloud' ? true : false}
              />
            </div>
          </ListItem>
        </List>
      </Paper>
      {langVoices.length && (
        <Menu
          id="voice-menu"
          anchorEl={anchorEl}
          open={isVoiceOpen}
          onClose={handleVoiceClose}
        >
          {langVoices.map((voice, index) => (
            <MenuItem
              key={index}
              selected={index === selectedVoiceIndex}
              onClick={() => onMenuItemClick(voice, index)}
            >
              <div className="Speech__VoiceMenuItemText">
                <div className="Speech__VoiceLabel">{getVoiceLabel(voice)}</div>
                {voice.voiceSource === 'cloud' && (
                  <Chip label="online" size="small" color="secondary" />
                )}
              </div>
            </MenuItem>
          ))}
        </Menu>
      )}
    </FullScreenDialog>
  </div>
);

Speech.propTypes = propTypes;

export default withStyles(styles)(Speech);
