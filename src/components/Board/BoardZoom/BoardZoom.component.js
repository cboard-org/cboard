import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import IconButton from '../../UI/IconButton';

import messages from './BoardZoom.messages';
import './BoardZoom.css';

const BoardZoom = ({
  intl,
  zoomInDisabled,
  zoomOutDisabled,
  onZoomInClick,
  onZoomOutClick
}) => (
  <div className="BoardZoom">
    <IconButton
      label={intl.formatMessage(messages.zoomIn)}
      disabled={zoomInDisabled}
      onClick={onZoomInClick}
    >
      <ZoomInIcon />
    </IconButton>
    <IconButton
      label={intl.formatMessage(messages.zoomOut)}
      disabled={zoomOutDisabled}
      onClick={onZoomOutClick}
    >
      <ZoomOutIcon />
    </IconButton>
  </div>
);

BoardZoom.defaultProps = {
  zoomInDisabled: false,
  zoomOutDisabled: false,
  onZoomInClick: () => {},
  onZoomOutClick: () => {}
};

BoardZoom.propTypes = {
  onZoomOutClick: PropTypes.func.isRequired,
  onZoomInClick: PropTypes.func.isRequired
};

export default injectIntl(BoardZoom);
