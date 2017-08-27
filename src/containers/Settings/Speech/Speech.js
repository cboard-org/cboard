import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from 'material-ui/styles';
import { injectIntl, FormattedMessage } from 'react-intl';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';
import { LinearProgress } from 'material-ui/Progress';
import debounce from 'lodash.debounce';

// Icons
import ArrowDownwardIcon from 'material-ui-icons/ArrowDownward';
import ArrowUpwardIcon from 'material-ui-icons/ArrowUpward';
import FastForwardIcon from 'material-ui-icons/FastForward';
import FastRewindIcon from 'material-ui-icons/FastRewind';

import { changeVoice, changePitch, changeRate } from '../../../speech/actions';
import speech from '../../../speech';
import FullScreenDialog from '../../../components/FullScreenDialog';
import messages from './messages';

const MIN_PITCH = 0.0;
const MAX_PITCH = 2.0;
const INCREMENT_PITCH = 0.25;
const MIN_RATE = 0.0;
const MAX_RATE = 2.0;
const INCREMENT_RATE = 0.25;

const styles = theme => ({
  container: {
    flexGrow: 1,
    display: 'flex',
    position: 'relative'
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
  constructor(props) {
    super(props);

    this.state = {
      selectedVoiceIndex: 0,
      voiceOpen: false
    };
  }

  speakSample = debounce(
    () => {
      const { intl } = this.props;
      const text = intl.formatMessage(messages.sampleSentence);
      speech.speak(text);
    },
    500,
    {}
  );

  handleClickListItem = () => {
    this.setState({ voiceOpen: true });
  };

  handleMenuItemClick = ({ voiceURI, lang }) => {
    const { changeVoice } = this.props;
    changeVoice(voiceURI, lang);
    this.speakSample();
    this.setState({ voiceOpen: false });
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
      open,
      locale,
      onCancel,
      speech: { voices, voiceURI, pitch, rate },
      classes
    } = this.props;

    const localeVoices = voices.filter(
      voice => voice.lang.slice(0, 2) === locale
    );

    return (
      <div className="Speech">
        <FullScreenDialog
          open={open}
          title={<FormattedMessage {...messages.speech} />}
          onCancel={onCancel}
        >
          <List>
            <ListItem
              button
              divider
              aria-haspopup="true"
              aria-controls="voice-menu"
              aria-label="Voice"
              onClick={this.handleClickListItem}
            >
              <ListItemText primary="Voice" secondary={voiceURI} />
            </ListItem>
            <ListItem divider aria-label="Pitch">
              <ListItemText
                primary="Pitch"
                secondary="Raise or lower the pitch for the voice"
              />
              <div className={classes.container}>
                <Button
                  color="primary"
                  aria-label="Lower Pitch"
                  disabled={pitch <= MIN_PITCH}
                  onClick={() =>
                    this.handleChangePitch(pitch - INCREMENT_PITCH)}
                >
                  Lower <ArrowDownwardIcon className={classes.icon} />
                </Button>
                <div className={classes.progress}>
                  <LinearProgress
                    mode="determinate"
                    value={getProgressPercent(pitch, MIN_PITCH, MAX_PITCH)}
                  />
                </div>
                <Button
                  color="primary"
                  aria-label="Raise Pitch"
                  disabled={pitch >= MAX_PITCH}
                  onClick={() =>
                    this.handleChangePitch(pitch + INCREMENT_PITCH)}
                >
                  <ArrowUpwardIcon className={classes.icon} /> Higher
                </Button>
              </div>
            </ListItem>
            <ListItem aria-label="Rate">
              <ListItemText
                primary="Rate"
                secondary="Make the voice speak faster or slower"
              />
              <div className={classes.container}>
                <Button
                  color="primary"
                  aria-label="Slower Rate"
                  disabled={rate <= MIN_RATE}
                  onClick={() => this.handleChangeRate(rate - INCREMENT_RATE)}
                >
                  Slower <FastRewindIcon className={classes.icon} />
                </Button>
                <div className={classes.progress}>
                  <LinearProgress
                    mode="determinate"
                    value={getProgressPercent(rate, MIN_RATE, MAX_RATE)}
                  />
                </div>
                <Button
                  color="primary"
                  aria-label="Faster Rate"
                  disabled={rate >= MAX_RATE}
                  onClick={() => this.handleChangeRate(rate + INCREMENT_RATE)}
                >
                  <FastForwardIcon className={classes.icon} /> Faster
                </Button>
              </div>
            </ListItem>
          </List>
          <Menu
            id="voice-menu"
            anchorEl={this.state.anchorEl}
            open={this.state.voiceOpen}
            onRequestClose={this.handleVoiceRequestClose}
          >
            {localeVoices.map((voice, index) =>
              <MenuItem
                key={index}
                selected={index === this.state.selectedVoiceIndex}
                onClick={event => this.handleMenuItemClick(voice)}
              >
                {voice.name}
              </MenuItem>
            )}
          </Menu>
        </FullScreenDialog>
      </div>
    );
  }
}

Speech.propTypes = {
  open: PropTypes.bool,
  locale: PropTypes.string,
  speech: PropTypes.object,
  voices: PropTypes.array,
  onCancel: PropTypes.func,
  changeVoice: PropTypes.func,
  changePitch: PropTypes.func,
  changeRate: PropTypes.func
};

const mapStateToProps = state => {
  return {
    locale: state.language.locale,
    voices: state.speech.voices,
    speech: state.speech
  };
};

export function mapDispatchToProps(dispatch) {
  return {
    changeVoice: (voiceURI, lang) => {
      dispatch(changeVoice(voiceURI, lang));
    },
    changePitch: pitch => {
      dispatch(changePitch(pitch));
    },
    changeRate: rate => {
      dispatch(changeRate(rate));
    }
  };
}

const EnhancedSpeech = compose(injectIntl, withStyles(styles))(Speech);
export default connect(mapStateToProps, mapDispatchToProps)(EnhancedSpeech);
