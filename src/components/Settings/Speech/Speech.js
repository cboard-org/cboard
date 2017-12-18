import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import debounce from 'lodash.debounce';
import { withStyles } from 'material-ui/styles';
import { injectIntl, FormattedMessage } from 'react-intl';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';
import { LinearProgress } from 'material-ui/Progress';
import ArrowDownwardIcon from 'material-ui-icons/ArrowDownward';
import ArrowUpwardIcon from 'material-ui-icons/ArrowUpward';
import FastForwardIcon from 'material-ui-icons/FastForward';
import FastRewindIcon from 'material-ui-icons/FastRewind';

import {
  speak,
  changeVoice,
  changePitch,
  changeRate
} from '../../SpeechProvider/SpeechProvider.actions';
import FullScreenDialog from '../../FullScreenDialog';
import messages from './Speech.messages';

const MIN_PITCH = 0.0;
const MAX_PITCH = 2.0;
const INCREMENT_PITCH = 0.25;
const MIN_RATE = 0.0;
const MAX_RATE = 2.0;
const INCREMENT_RATE = 0.25;

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

export class Speech extends PureComponent {
  static propTypes = {
    /**
     * If true, Speech will be visible
     */
    open: PropTypes.bool,
    /**
     * Active language
     */
    lang: PropTypes.string,
    speech: PropTypes.object,
    voices: PropTypes.array,
    onRequestClose: PropTypes.func,
    changeVoice: PropTypes.func,
    changePitch: PropTypes.func,
    changeRate: PropTypes.func
  };

  state = {
    selectedVoiceIndex: 0,
    voiceOpen: false,
    anchorEl: null
  };

  speakSample = debounce(
    () => {
      const { intl, speak } = this.props;
      const text = intl.formatMessage(messages.sampleSentence);
      speak(text);
    },
    500,
    {}
  );

  handleClickListItem = event => {
    this.setState({ voiceOpen: true, anchorEl: event.currentTarget });
  };

  handleMenuItemClick = ({ voiceURI, lang }, index) => {
    const { changeVoice } = this.props;
    changeVoice(voiceURI, lang);
    this.speakSample();
    this.setState({ voiceOpen: false, selectedVoiceIndex: index });
  };

  handleChangePitch = value => {
    const { changePitch } = this.props;
    changePitch(value);
    this.speakSample();
  };

  handleChangeRate = value => {
    const { changeRate } = this.props;
    changeRate(value);
    this.speakSample();
  };

  handleVoiceRequestClose = () => {
    this.setState({ voiceOpen: false });
  };

  render() {
    const {
      intl,
      classes,
      open,
      lang,
      onRequestClose,
      speech: { voices, options: { voiceURI, pitch, rate } }
    } = this.props;

    const langVoices = voices.filter(
      voice => voice.lang.slice(0, 2) === lang.slice(0, 2)
    );

    return (
      <div className="Speech">
        <FullScreenDialog
          open={open}
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
                onClick={this.handleClickListItem}
              >
                <ListItemText
                  primary={<FormattedMessage {...messages.voice} />}
                  secondary={voiceURI}
                />
              </ListItem>
              <ListItem divider aria-label={intl.formatMessage(messages.pitch)}>
                <ListItemText
                  primary={<FormattedMessage {...messages.pitch} />}
                  secondary={
                    <FormattedMessage {...messages.pitchDescription} />
                  }
                />
                <div className={classes.container}>
                  <Button
                    color="primary"
                    aria-label={intl.formatMessage(messages.lower)}
                    disabled={pitch <= MIN_PITCH}
                    onClick={() =>
                      this.handleChangePitch(pitch - INCREMENT_PITCH)
                    }
                  >
                    <ArrowDownwardIcon className={classes.icon} />
                  </Button>
                  <div className={classes.progress}>
                    <LinearProgress
                      mode="determinate"
                      value={getProgressPercent(pitch, MIN_PITCH, MAX_PITCH)}
                    />
                  </div>
                  <Button
                    color="primary"
                    aria-label={intl.formatMessage(messages.higher)}
                    disabled={pitch >= MAX_PITCH}
                    onClick={() =>
                      this.handleChangePitch(pitch + INCREMENT_PITCH)
                    }
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
                    onClick={() => this.handleChangeRate(rate - INCREMENT_RATE)}
                  >
                    <FastRewindIcon className={classes.icon} />
                  </Button>
                  <div className={classes.progress}>
                    <LinearProgress
                      mode="determinate"
                      value={getProgressPercent(rate, MIN_RATE, MAX_RATE)}
                    />
                  </div>
                  <Button
                    color="primary"
                    aria-label={intl.formatMessage(messages.faster)}
                    disabled={rate >= MAX_RATE}
                    onClick={() => this.handleChangeRate(rate + INCREMENT_RATE)}
                  >
                    <FastForwardIcon className={classes.icon} />
                  </Button>
                </div>
              </ListItem>
            </List>
          </Paper>
          <Menu
            id="voice-menu"
            anchorEl={this.state.anchorEl}
            open={this.state.voiceOpen}
            onClose={this.handleVoiceRequestClose}
          >
            {langVoices.map((voice, index) => (
              <MenuItem
                key={index}
                selected={index === this.state.selectedVoiceIndex}
                onClick={event => this.handleMenuItemClick(voice, index)}
              >
                {voice.name}
              </MenuItem>
            ))}
          </Menu>
        </FullScreenDialog>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.language.lang,
  voices: state.speech.voices,
  speech: state.speech
});

const mapDispatchToProps = dispatch => ({
  changeVoice: (voiceURI, lang) => {
    dispatch(changeVoice(voiceURI, lang));
  },
  changePitch: pitch => {
    dispatch(changePitch(pitch));
  },
  changeRate: rate => {
    dispatch(changeRate(rate));
  },
  speak: text => {
    dispatch(speak(text));
  }
});

const EnhancedSpeech = compose(injectIntl, withStyles(styles))(Speech);
export default connect(mapStateToProps, mapDispatchToProps)(EnhancedSpeech);
