import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * Stroke width
   */
  strokeWidth: PropTypes.number,
  /**
   * Fill color
   */
  fill: PropTypes.string
};

const defaultProps = {
  fill: 'transparent',
  strokeWidth: 0
};

function Circle(props) {
  const { fill, strokeWidth } = props;

  return (
    <svg height="48" width="48">
      <circle
        cx="24"
        cy="24"
        r="15"
        fill={fill}
        stroke="black"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

Circle.propTypes = propTypes;
Circle.defaultProps = defaultProps;

export default Circle;
