import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

import IconButton from '../IconButton';
import messages from './FullScreenButton.messages';
import { doc } from 'prettier';

const FullScreenButton = ({ disabled, intl }) => {
  const [fullscreen, setFullscreen] = useState(false);
  const requestFullScreen = useCallback(element => {
    let request =
      element.requestFullscreen ||
      element.webkitRequestFullscreen ||
      element.mozRequestFullScreen;
    if (request) {
      request.call(element);
      setFullscreen(true);
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    let request =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen;
    if (request) {
      request.call(document);
      setFullscreen(false);
    }
  }, []);
  const toggleFullScreen = useCallback(
    () => {
      if (fullscreen) {
        exitFullscreen();
      } else {
        requestFullScreen(document.documentElement);
      }
    },
    [fullscreen, requestFullScreen, exitFullscreen]
  );

  const handleClick = useCallback(
    () => {
      toggleFullScreen();
    },
    [toggleFullScreen]
  );

  const fullScreenLabel = fullscreen
    ? intl.formatMessage(messages.exitFullscreen)
    : intl.formatMessage(messages.fullscreen);

  return (
    <IconButton
      disabled={disabled}
      label={fullScreenLabel}
      onClick={handleClick}
    >
      {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
    </IconButton>
  );
};

FullScreenButton.propTypes = {
  disabled: PropTypes.bool,

  intl: intlShape.isRequired
};

export default injectIntl(FullScreenButton);
