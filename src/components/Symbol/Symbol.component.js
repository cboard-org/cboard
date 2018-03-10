import React from 'react';
import PropTypes from 'prop-types';

import './Symbol.css';

SymbolComponent.propTypes = {
  /**
   * Image source path
   */
  img: PropTypes.string,
  /**
   * Label to display
   */
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

SymbolComponent.defaultProps = {
  label: ''
};

function SymbolComponent({ label, img }) {
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

export default SymbolComponent;
