import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

import IconButton from '../IconButton';
import messages from './FullScreenButton.messages';

const propTypes = {
  /**
   * If true, button will be disabled
   */
  disabled: PropTypes.bool,
  /**
   * @ignore
   */
  intl: intlShape.isRequired
};

const FullScreenButton = ({ disabled, intl }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const requestFullscreen = useCallback(element => {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
    setIsFullScreen(true);
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    setIsFullScreen(false);
  }, []);

  const toggleFullscreen = useCallback(
    () => {
      if (isFullScreen) {
        return exitFullscreen();
      }
      return requestFullscreen(window.document.documentElement);
    },
    [isFullScreen, requestFullscreen, exitFullscreen]
  );

  const handleClick = useCallback(
    () => {
      toggleFullscreen();
    },
    [toggleFullscreen]
  );

  useEffect(() => {
    const events = [
      'fullscreenchange',
      'mozfullscreenchange',
      'webkitfullscreenchange'
    ];

    const handleFullScreenChange = () => {
      const fullScreenElement =
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement;
      setIsFullScreen(!!fullScreenElement);
    };
    events.forEach(event =>
      document.addEventListener(event, handleFullScreenChange)
    );

    return () => {
      events.forEach(event =>
        document.removeEventListener(event, handleFullScreenChange)
      );
    };
  }, []);

  const fullScreenLabel = isFullScreen
    ? intl.formatMessage(messages.exitFullscreen)
    : intl.formatMessage(messages.fullscreen);

  return (
    <IconButton
      disabled={disabled}
      label={fullScreenLabel}
      onClick={handleClick}
    >
      {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
    </IconButton>
  );
};

FullScreenButton.propTypes = propTypes;

export default injectIntl(FullScreenButton);
