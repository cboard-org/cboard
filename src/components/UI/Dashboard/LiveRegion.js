import React from 'react';
import PropTypes from 'prop-types';

const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0
};

const LiveRegion = ({ message }) => (
  <div
    role="status"
    aria-live="polite"
    aria-atomic="true"
    style={visuallyHidden}
  >
    {message}
  </div>
);

LiveRegion.propTypes = {
  message: PropTypes.string
};

LiveRegion.defaultProps = {
  message: ''
};

export default LiveRegion;
