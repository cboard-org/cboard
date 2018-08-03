import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
  const { className, image, label, ...other } = props;

  const symbolClassName = classNames('Symbol', className);

  return (
    <div className={symbolClassName} {...other}>
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
