import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import AddIcon from 'material-ui-icons/Add';
import RemoveIcon from 'material-ui-icons/Remove';

import messages from './messages';
import { changeVoice, changePitch, changeRate } from '../../../speech/actions';
import speech from '../../../speech';
import FullScreenDialog from '../../../components/FullScreenDialog';

export class Speech extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedVoiceIndex: 0,
      voiceOpen: false
    };
  }

  handleClickListItem = () => {
    this.setState({ voiceOpen: true });
  };

  handleMenuItemClick = ({ voiceURI, lang }) => {
    const { changeVoice, intl } = this.props;
    changeVoice(voiceURI, lang);
    const text = intl.formatMessage(messages.sampleSentence);
    speech.speak(text);
    this.setState({ voiceOpen: false });
  };

  handleVoiceRequestClose = () => {
    this.setState({ voiceOpen: false });
  };

  render() {
    const { open, locale, onCancel, speech: { voices, voiceURI } } = this.props;

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
            <ListItem button divider>
              <ListItemText primary="Pitch" secondary="Change pitch" />
              <ListItemSecondaryAction>
                <IconButton>
                  <RemoveIcon />
                </IconButton>
                <IconButton>
                  <AddIcon />
                </IconButton>
              </ListItemSecondaryAction>
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
  activeTextToSpeech: PropTypes.string,
  locale: PropTypes.string,
  voices: PropTypes.array,
  speech: PropTypes.object,
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Speech));
