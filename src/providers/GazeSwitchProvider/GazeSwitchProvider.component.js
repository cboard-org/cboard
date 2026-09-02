import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import GazeController, { GAZE_STATUS } from './GazeController';
import messages from './GazeSwitchProvider.messages';
import './GazeSwitchProvider.css';

const STATUS_MESSAGE = {
  [GAZE_STATUS.LOADING]: messages.loading,
  [GAZE_STATUS.READY]: messages.ready,
  [GAZE_STATUS.NO_FACE]: messages.noFace,
  [GAZE_STATUS.ERROR]: messages.error
};

/**
 * Dispatches a synthetic switch activation that react-scannable interprets as a
 * "select". In automatic scanning any non-escape keydown on document.body
 * selects the highlighted item, so we emit an Enter keydown. keyCode is defined
 * explicitly because constructed KeyboardEvents report keyCode 0.
 */
function dispatchScannerSwitch() {
  const event = new KeyboardEvent('keydown', {
    key: 'Enter',
    bubbles: true,
    cancelable: true
  });
  Object.defineProperty(event, 'keyCode', { get: () => 13 });
  Object.defineProperty(event, 'which', { get: () => 13 });
  document.body.dispatchEvent(event);
}

class GazeSwitchProvider extends React.Component {
  static propTypes = {
    /** Master toggle for the feature. */
    active: PropTypes.bool,
    /** Whether Cboard's scanner is currently active. */
    scannerActive: PropTypes.bool,
    blinkThreshold: PropTypes.number,
    dwellMs: PropTypes.number,
    cooldownMs: PropTypes.number,
    showPreview: PropTypes.bool
  };

  state = {
    status: GAZE_STATUS.IDLE,
    progress: 0
  };

  videoRef = React.createRef();

  // Eye control only runs while scanning is also active.
  get isEnabled() {
    return !!(this.props.active && this.props.scannerActive);
  }

  componentDidMount() {
    this.controller = new GazeController(this.controllerOptions());
    this.controller.onStatus = (status) => this.setState({ status });
    this.controller.onProgress = (progress) => this.setState({ progress });
    this.controller.onSwitch = this.handleSwitch;

    if (this.isEnabled) {
      this.startController();
    }
  }

  componentDidUpdate(prevProps) {
    const optionKeys = ['blinkThreshold', 'dwellMs', 'cooldownMs'];
    if (optionKeys.some((k) => prevProps[k] !== this.props[k])) {
      this.controller.setOptions(this.controllerOptions());
    }

    const wasEnabled = !!(prevProps.active && prevProps.scannerActive);
    if (!wasEnabled && this.isEnabled) {
      this.startController();
    } else if (wasEnabled && !this.isEnabled) {
      this.controller.stop();
      this.setState({ progress: 0 });
    }
  }

  componentWillUnmount() {
    if (this.controller) {
      this.controller.stop();
    }
  }

  controllerOptions() {
    const { blinkThreshold, dwellMs, cooldownMs } = this.props;
    return { blinkThreshold, dwellMs, cooldownMs };
  }

  startController() {
    if (this.videoRef.current) {
      this.controller.start(this.videoRef.current);
    }
  }

  handleSwitch = () => {
    // Only drive selections while the scanner is running, so a blink can't
    // accidentally activate arbitrary buttons elsewhere in the UI.
    if (this.props.scannerActive) {
      dispatchScannerSwitch();
    }
  };

  render() {
    const { showPreview } = this.props;
    const { status, progress } = this.state;

    if (!this.isEnabled) {
      return null;
    }

    const statusMessage = STATUS_MESSAGE[status] || messages.loading;

    return (
      <div className="GazeSwitchWidget" role="status" aria-live="polite">
        <div
          className={classNames('GazeSwitchWidget__preview', {
            'GazeSwitchWidget__preview--hidden': !showPreview
          })}
        >
          <video
            ref={this.videoRef}
            className={classNames('GazeSwitchWidget__video', {
              'GazeSwitchWidget__video--hidden': !showPreview
            })}
            playsInline
            muted
          />
          {showPreview && (
            <div
              className="GazeSwitchWidget__progress"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          )}
        </div>
        <div className="GazeSwitchWidget__body">
          <span className="GazeSwitchWidget__title">
            <span
              className={classNames(
                'GazeSwitchWidget__dot',
                `GazeSwitchWidget__dot--${status}`
              )}
            />
            <FormattedMessage {...messages.eyeControl} />
          </span>
          <span className="GazeSwitchWidget__status">
            <FormattedMessage {...statusMessage} />
          </span>
        </div>
      </div>
    );
  }
}

export default GazeSwitchProvider;
