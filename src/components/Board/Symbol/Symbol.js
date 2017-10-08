import React from 'react';
import PropTypes from 'prop-types';

import './Symbol.css';

Symbol.propTypes = {
  /**
   * Image source path
   */
  img: PropTypes.string,
  /**
   * Label to display
   */
  label: PropTypes.string.isRequired
};

Symbol.defaultProps = {
  label: ''
};

function Symbol({ label, img }) {
  debugger;
  return (
    <div className="Symbol">
      {img && (
        <div className="Symbol__container">
          <img className="Symbol__image" src={img} alt="" />
        </div>
      )}
      <div className="Symbol__label">{label}</div>
    </div>
  );
}

export default Symbol;
