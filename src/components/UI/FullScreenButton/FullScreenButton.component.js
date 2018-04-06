import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import FullscreenIcon from 'material-ui-icons/Fullscreen';
import FullscreenExitIcon from 'material-ui-icons/FullscreenExit';

import IconButton from '../IconButton';
import messages from './FullScreenButton.messages';

const propTypes = {
  intl: intlShape.isRequired,
  disabled: PropTypes.bool
};

class FullScreenButton extends PureComponent {
  state = { fullscreen: false };

  requestFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
    this.setState({ fullscreen: true });
  }

  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    this.setState({ fullscreen: false });
  }

  toggleFullscreen() {
    if (this.state.fullscreen) {
      this.exitFullscreen();
    } else {
      this.requestFullscreen(window.document.documentElement);
    }
  }

  handleFullscreen = () => {
    this.toggleFullscreen();
  };

  render() {
    const { intl, disabled } = this.props;
    const fullScreenString = this.state.fullscreen
      ? intl.formatMessage(messages.exitFullscreen)
      : intl.formatMessage(messages.fullscreen);

    return (
      <IconButton
        label={fullScreenString}
        disabled={disabled}
        onClick={this.handleFullscreen}
      >
        {this.state.fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>
    );
  }
}

FullScreenButton.propTypes = propTypes;

export default injectIntl(FullScreenButton);
