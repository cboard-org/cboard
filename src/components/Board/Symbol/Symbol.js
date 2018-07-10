import React from 'react';
import PropTypes from 'prop-types';

import './Symbol.css';

const propTypes = {
  /**
   * Image to display
   */
  image: PropTypes.string,
  /**
   * Label to display
   */
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired
};

function Symbol(props) {
  const { image, label } = props;

  return (
    <div className="Symbol">
      {image && (
        <div className="Symbol__image-container">
          <img className="Symbol__image" src={image} alt="" />
        </div>
      )}
      <div className="Symbol__label">{label}</div>
    </div>
  );
}

Symbol.propTypes = propTypes;

export default Symbol;
