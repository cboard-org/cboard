import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';

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
  fill: 'transparent'
};

function Circle(props) {
  const { fill, color = 'grey', strokeWidth = '1' } = props;

  return (
    <svg height="48" width="48">
      <circle
        cx="24"
        cy="24"
        r="15"
        fill={fill}
        color={color}
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

Circle.propTypes = propTypes;
Circle.defaultProps = defaultProps;

export default Circle;
