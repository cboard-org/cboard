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
import TextField from '@material-ui/core/TextField';
import {
  IconButton,
  CircularProgress,
  FormHelperText,
  Tooltip,
  Button
} from '@material-ui/core';
import CloudIcon from '@material-ui/icons/Cloud';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

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
import PremiumFeature from '../../PremiumFeature';
import { max } from 'lodash';

const propTypes = {
  handleChangePitch: PropTypes.func,
  handleChangeRate: PropTypes.func,
  handleChangeElevenLabsStability: PropTypes.func,
  handleChangeElevenLabsSimilarity: PropTypes.func,
  handleChangeElevenLabsStyle: PropTypes.func,
  handleResetElevenLabsSettings: PropTypes.func,
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
  elevenLabsSettings: PropTypes.object,
  elevenLabsApiKey: PropTypes.string,
  elevenLabsConnected: PropTypes.bool,
  handleElevenLabsApiKeyChange: PropTypes.func,
  testElevenLabsConnection: PropTypes.func,
  elevenLabsValidationError: PropTypes.string,
  elevenLabsValidating: PropTypes.bool
};

const styles = theme => ({
  container: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '461px',
    paddingLeft: '12px'
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
  handleChangeElevenLabsStability,
  handleChangeElevenLabsSimilarity,
  handleChangeElevenLabsStyle,
  handleResetElevenLabsSettings,
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
  elevenLabsSettings,
  elevenLabsApiKey,
  elevenLabsConnected,
  handleElevenLabsApiKeyChange,
  testElevenLabsConnection,
  elevenLabsValidationError,
  elevenLabsValidating
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
            divider
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

          {voice?.voiceSource === 'elevenlabs' && (
            <>
              <ListItem
                divider
                aria-label={intl.formatMessage(messages.elevenLabsStability)}
              >
                <ListItemText
                  className="Speech__ListItemText"
                  primary={
                    <FormattedMessage {...messages.elevenLabsStability} />
                  }
                  secondary={
                    <FormattedMessage
                      {...messages.elevenLabsStabilityDescription}
                    />
                  }
                />
                <div className={classes.container}>
                  <Slider
                    color="secondary"
                    value={elevenLabsSettings?.stability || 0.5}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={handleChangeElevenLabsStability}
                  />
                </div>
              </ListItem>
              <ListItem
                divider
                aria-label={intl.formatMessage(messages.elevenLabsSimilarity)}
              >
                <ListItemText
                  className="Speech__ListItemText"
                  primary={
                    <FormattedMessage {...messages.elevenLabsSimilarity} />
                  }
                  secondary={
                    <FormattedMessage
                      {...messages.elevenLabsSimilarityDescription}
                    />
                  }
                />
                <div className={classes.container}>
                  <Slider
                    color="secondary"
                    value={elevenLabsSettings?.similarity || 0.75}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={handleChangeElevenLabsSimilarity}
                  />
                </div>
              </ListItem>
              <ListItem
                divider
                aria-label={intl.formatMessage(messages.elevenLabsStyle)}
              >
                <ListItemText
                  className="Speech__ListItemText"
                  primary={<FormattedMessage {...messages.elevenLabsStyle} />}
                  secondary={
                    <FormattedMessage
                      {...messages.elevenLabsStyleDescription}
                    />
                  }
                />
                <div className={classes.container}>
                  <Slider
                    color="secondary"
                    value={elevenLabsSettings?.style || 0.0}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={handleChangeElevenLabsStyle}
                  />
                </div>
              </ListItem>
              <ListItem>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '16px 0'
                  }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleResetElevenLabsSettings}
                    size="small"
                  >
                    <FormattedMessage {...messages.resetToDefaults} />
                  </Button>
                </div>
              </ListItem>
            </>
          )}
        </List>

        <ListItem divider>
          <ListItemText
            primary={<FormattedMessage {...messages.elevenLabsApiKey} />}
            secondary={
              <div>
                <FormattedMessage {...messages.elevenLabsApiKeyDescription} />
                {elevenLabsValidationError && (
                  <FormHelperText error>
                    {elevenLabsValidationError}
                  </FormHelperText>
                )}
              </div>
            }
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TextField
              type="password"
              value={elevenLabsApiKey || ''}
              onChange={handleElevenLabsApiKeyChange}
              placeholder="sk_..."
              error={!!elevenLabsValidationError}
              variant="outlined"
              size="small"
              style={{ minWidth: '200px' }}
            />
            <IconButton
              onClick={testElevenLabsConnection}
              disabled={elevenLabsValidating || !elevenLabsApiKey}
            >
              {elevenLabsValidating ? (
                <CircularProgress size={20} />
              ) : elevenLabsConnected ? (
                <CheckCircleIcon color="primary" />
              ) : elevenLabsValidationError ? (
                <ErrorIcon color="error" />
              ) : (
                <CloudIcon color="disabled" />
              )}
            </IconButton>
          </div>
        </ListItem>
      </Paper>
      {langVoices.length && (
        <Menu
          id="voice-menu"
          anchorEl={anchorEl}
          open={isVoiceOpen}
          onClose={handleVoiceClose}
        >
          {langVoices.map((voice, index) => {
            const VoiceItem = (
              <MenuItem
                key={index}
                selected={index === selectedVoiceIndex}
                onClick={() => onMenuItemClick(voice, index)}
              >
                <div className="Speech__VoiceMenuItemText">
                  <div className="Speech__VoiceLabel">
                    {getVoiceLabel(voice)}
                  </div>
                  {voice.voiceSource === 'elevenlabs' && (
                    <Chip label="ElevenLabs" size="small" color="primary" />
                  )}
                  {(voice.voiceSource === 'cloud' ||
                    voice.voiceSource === 'elevenlabs') && (
                    <Chip label="online" size="small" color="secondary" />
                  )}
                </div>
              </MenuItem>
            );

            const PremiumVoice = <PremiumFeature> {VoiceItem}</PremiumFeature>;

            const VoiceOption =
              voice.voiceSource === 'cloud' ||
              voice.voiceSource === 'elevenlabs'
                ? PremiumVoice
                : VoiceItem;
            return VoiceOption;
          })}
        </Menu>
      )}
    </FullScreenDialog>
  </div>
);

Speech.propTypes = propTypes;

export default withStyles(styles)(Speech);
