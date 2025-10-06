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
import { IconButton, CircularProgress } from '@material-ui/core';
import CloudIcon from '@material-ui/icons/Cloud';

import FullScreenDialog from '../../UI/FullScreenDialog';
import ApiKeyTextField from '../../UI/FormItems/ApiKeyTextField';
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
import PremiumFeature from '../../PremiumFeature';

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
  voice: PropTypes.object.isRequired,
  elevenLabsApiKey: PropTypes.string,
  handleUpdateElevenLabsApiKey: PropTypes.func,
  elevenLabsConnected: PropTypes.bool,
  elevenLabsValidating: PropTypes.bool,
  elevenLabsConnectionError: PropTypes.string
};

const styles = theme => ({
  container: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    width: '100%'
  },
  apiKeyInput: {
    width: '200px',
    [theme.breakpoints.up('sm')]: {
      width: '300px'
    },
    '& .MuiTextField-root': {
      width: '100%'
    }
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
  voice,
  elevenLabsApiKey,
  handleUpdateElevenLabsApiKey,
  elevenLabsConnected,
  elevenLabsValidating,
  elevenLabsConnectionError
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
      <Paper style={{ marginTop: 10 }}>
        <List>
          <ListItem>
            <ListItemText
              primary={<FormattedMessage {...messages.elevenLabsApiKey} />}
              secondary={
                <FormattedMessage {...messages.elevenLabsApiKeyDescription} />
              }
            />
            <div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <div className={classes.apiKeyInput}>
                  <ApiKeyTextField
                    label=""
                    name="elevenlabs-api-key"
                    value={elevenLabsApiKey || ''}
                    onChange={e => {
                      handleUpdateElevenLabsApiKey(e.target.value || null);
                    }}
                    placeholder="sk-..."
                    error={!!elevenLabsConnectionError}
                  />
                </div>
                <IconButton disabled>
                  {elevenLabsValidating ? (
                    <CircularProgress size={20} />
                  ) : (
                    <CloudIcon
                      color={elevenLabsConnected ? 'primary' : 'disabled'}
                    />
                  )}
                </IconButton>
              </div>
              {elevenLabsConnectionError === 'INVALID_FORMAT' && (
                <div style={{ color: '#f44336' }}>
                  <FormattedMessage {...messages.elevenLabsApiKeyInvalid} />
                </div>
              )}
              {elevenLabsConnectionError === 'UNAUTHORIZED' && (
                <div style={{ color: '#f44336' }}>
                  <FormattedMessage
                    {...messages.elevenLabsApiKeyUnauthorized}
                  />
                </div>
              )}
              {elevenLabsConnectionError &&
                elevenLabsConnectionError !== 'UNAUTHORIZED' &&
                elevenLabsConnectionError !== 'INVALID_FORMAT' && (
                  <div style={{ color: '#f44336' }}>
                    <FormattedMessage {...messages.elevenLabsTestError} />
                  </div>
                )}
              {elevenLabsConnected && (
                <div style={{ color: '#1976d2' }}>
                  <FormattedMessage {...messages.elevenLabsTestSuccess} />
                </div>
              )}
            </div>
          </ListItem>
        </List>
        <div className="Speech__HelpText">
          <FormattedMessage
            {...messages.elevenLabsApiKeyHelp}
            values={{
              elevenLabsLink: (
                <a
                  href="https://elevenlabs.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1976d2', textDecoration: 'none' }}
                >
                  elevenlabs.io
                </a>
              )
            }}
          />
        </div>
      </Paper>
      {langVoices.length && (
        <Menu
          id="voice-menu"
          anchorEl={anchorEl}
          open={isVoiceOpen}
          onClose={handleVoiceClose}
        >
          {langVoices.map((voice, index) => {
            const key = voice.voiceURI || index;
            const isPremium = voice.voiceSource === 'cloud';
            const isOnline =
              voice.voiceSource === 'cloud' ||
              voice.voiceSource === 'elevenlabs';

            const VoiceItem = (
              <MenuItem
                key={key}
                selected={index === selectedVoiceIndex}
                onClick={() => onMenuItemClick(voice, index)}
              >
                <div className="Speech__VoiceMenuItemText">
                  <div className="Speech__VoiceLabel">
                    {getVoiceLabel(voice)}
                  </div>
                  <div className="Speech__VoiceChips">
                    {voice.voiceSource === 'elevenlabs' && (
                      <Chip label="ElevenLabs" size="small" color="primary" />
                    )}
                    {isOnline && (
                      <Chip label="online" size="small" color="secondary" />
                    )}
                  </div>
                </div>
              </MenuItem>
            );

            return isPremium ? (
              <PremiumFeature key={key}>{VoiceItem}</PremiumFeature>
            ) : (
              VoiceItem
            );
          })}
        </Menu>
      )}
    </FullScreenDialog>
  </div>
);

Speech.propTypes = propTypes;

export default withStyles(styles)(Speech);
