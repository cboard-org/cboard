import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Symbol.css';

Symbol.propTypes = {
  className: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  img: PropTypes.string
};

Symbol.defaultProps = {
  className: '',
  label: '',
  img: ''
};

export function Symbol({ className, label, img }) {
  const symbolClassName = classNames(className, 'Symbol');

  return (
    <div className={symbolClassName}>
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
