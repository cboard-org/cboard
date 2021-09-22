import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isCordova } from '../../../cordova-util';
import TextField from '@material-ui/core/TextField';

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
  labelpos: PropTypes.string,
  type: PropTypes.string,
  onWrite: PropTypes.func.isRequired
};

function Symbol(props) {
  const { className, label, labelpos, type, onWrite, ...other } = props;

  // Cordova path cannot be absolute
  const image =
    isCordova() && props.image && props.image.search('/') === 0
      ? `.${props.image}`
      : props.image;

  const symbolClassName = classNames('Symbol', className);

  return (
    <div className={symbolClassName} {...other}>
      {props.type === 'live' && (
        <TextField
          id="outlined-multiline-static"
          label=""
          variant="filled"
          autoFocus={true}
          multiline
          rows={4}
          defaultValue={label}
          onChange={onWrite}
        />
      )}
      {props.type !== 'live' &&
        props.labelpos === 'Above' &&
        props.labelpos !== 'Hidden' && (
          <div className="Symbol__label">{label}</div>
        )}
      {image && (
        <div className="Symbol__image-container">
          <img className="Symbol__image" src={image} alt="" />
        </div>
      )}
      {props.type !== 'live' &&
        props.labelpos === 'Below' &&
        props.labelpos !== 'Hidden' && (
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
