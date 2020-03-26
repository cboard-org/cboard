import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isCordova } from '../../../cordova-util';

import { LABEL_POSITION_BELOW } from '../../Settings/Display/Display.constants';
import './Symbol.css';

const propTypes = {
  /**
   * Image to display
   */
  image: PropTypes.string,
  /**
   * Label to display
   */
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  labelpos: PropTypes.string
};

function Symbol(props) {
  const { className, label, labelpos, ...other } = props;

  // Cordova path cannot be absolute
  const image =
    isCordova() && props.image && props.image.search('/') === 0
      ? `.${props.image}`
      : props.image;

  const symbolClassName = classNames('Symbol', className);

  return (
    <div className={symbolClassName} {...other}>
      {props.labelpos === 'Above' && props.labelpos !== 'Hidden' && (
        <div className="Symbol__label">{label}</div>
      )}
      {image && (
        <div className="Symbol__image-container">
          <img className="Symbol__image" src={image} alt="" />
        </div>
      )}
      {props.labelpos === 'Below' && props.labelpos !== 'Hidden' && (
        <div className="Symbol__label">{label}</div>
      )}
    </div>
  );
}
Symbol.propTypes = propTypes;
Symbol.defaultProps = {
  labelpos: LABEL_POSITION_BELOW
};

export default Symbol;
