import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';

import { updateDisplaySettings } from '../../App/App.actions';
import { changeBoard } from '../Board.actions';
import IconButton from '../../UI/IconButton';
import { DISPLAY_SIZES } from '../../Settings/Display/Display.constants';
import messages from './BoardZoom.messages';
import './BoardZoom.css';

export class BoardZoom extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    displaySettings: PropTypes.object.isRequired,
    changeBoard: PropTypes.func.isRequired,
    updateDisplaySettings: PropTypes.func.isRequired
  };
  static defaultProps = {
    displaySettings: {
      uiSize: 'Standard'
    },
    userData: {}
  };
  state = {
    zoomOutDisabled: false,
    zoomInDisabled: false
  };
  onZoomInClick = () => {
    const {
      displaySettings,
      updateDisplaySettings,
      activeBoardId,
      changeBoard
    } = this.props;
    if (displaySettings.uiSize === DISPLAY_SIZES[DISPLAY_SIZES.length - 1]) {
      return;
    } else {
      const index = DISPLAY_SIZES.indexOf(displaySettings.uiSize) + 1;
      updateDisplaySettings({
        uiSize: DISPLAY_SIZES[index],
        fontSize: displaySettings.fontSize
      });
      changeBoard(activeBoardId);
      if (DISPLAY_SIZES[index] === DISPLAY_SIZES[DISPLAY_SIZES.length - 1]) {
        this.setState({ zoomInDisabled: true });
      }
    }
  };

  onZoomOutClick = () => {
    const {
      displaySettings,
      updateDisplaySettings,
      activeBoardId,
      changeBoard
    } = this.props;
    if (displaySettings.uiSize === DISPLAY_SIZES[0]) {
      return;
    } else {
      const index = DISPLAY_SIZES.indexOf(displaySettings.uiSize) - 1;
      updateDisplaySettings({
        uiSize: DISPLAY_SIZES[index],
        fontSize: displaySettings.fontSize
      });
      changeBoard(activeBoardId);
      if (DISPLAY_SIZES[index] === DISPLAY_SIZES[0]) {
        this.setState({ zoomOutDisabled: true });
      }
    }
  };

  render() {
    const { intl } = this.props;
    return (
      <div className="BoardZoom">
        <IconButton
          label={intl.formatMessage(messages.zoomIn)}
          disabled={this.state.zoomInDisabled}
          onClick={this.onZoomInClick}
        >
          <ZoomInIcon />
        </IconButton>
        <IconButton
          label={intl.formatMessage(messages.zoomOut)}
          disabled={this.state.zoomOutDisabled}
          onClick={this.onZoomOutClick}
        >
          <ZoomOutIcon />
        </IconButton>
      </div>
    );
  }
}

const mapStateToProps = ({
  board: { activeBoardId },
  app: { displaySettings, userData }
}) => {
  return {
    activeBoardId,
    displaySettings,
    userData
  };
};

const mapDispatchToProps = {
  changeBoard,
  updateDisplaySettings
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(BoardZoom));
