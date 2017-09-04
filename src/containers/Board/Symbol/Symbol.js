import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import './Symbol.css';

export const symbolPropType = {
  id: PropTypes.number,
  type: PropTypes.string,
  label: PropTypes.string,
  text: PropTypes.string,
  img: PropTypes.string,
  boardId: PropTypes.string
};

export function Symbol({
  className,
  children,
  id,
  type,
  label,
  text,
  img,
  boardId,
  symbolRef,
  onClick,
  onFocus
}) {
  const symbolClasses = classNames(className, {
    Symbol: true,
    'Symbol--folder': type === 'folder'
  });

  const symbol = { id, type, label, text, img, boardId };

  return (
    <button
      className={symbolClasses}
      ref={symbolRef}
      onClick={() => {
        onClick(symbol);
      }}
      onFocus={() => onFocus(symbol)}
    >
      {img && (
        <div className="Symbol__container">
          <img className="Symbol__image" src={img} alt="" />
        </div>
      )}
      <div className="Symbol__label">
        <FormattedMessage id={label} />
      </div>
      {children}
    </button>
  );
}

Symbol.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  symbolRef: PropTypes.func,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  ...symbolPropType
};

Symbol.defaultProps = {
  className: '',
  id: 0,
  type: '',
  label: '',
  text: '',
  img: '',
  boardId: ''
};

export default Symbol;
