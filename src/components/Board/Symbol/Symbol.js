import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isCordova } from '../../../cordova-util';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import messages from '../Board.messages';

import {
  LABEL_POSITION_BELOW,
  LABEL_CASE_LOWER,
  LABEL_CASE_DEFAULT,
  LABEL_CASE_UPPER
} from '../../Settings/Display/Display.constants';
import './Symbol.css';
import { Typography } from '@material-ui/core';
import { getArasaacDB } from '../../../idb/arasaac/arasaacdb';

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
  labelCase: PropTypes.string,
  type: PropTypes.string,
  onWrite: PropTypes.func,
  intl: PropTypes.object
};

function Symbol(props) {
  const {
    className,
    label,
    labelpos,
    labelCase,
    keyPath,
    type,
    onWrite,
    intl,
    image,
    ...other
  } = props;
  const [src, setSrc] = useState('');

  useEffect(
    () => {
      async function getSrc() {
        let image = null;
        if (keyPath) {
          const arasaacDB = await getArasaacDB();
          image = await arasaacDB.getImageById(keyPath);
        }

        if (image) {
          const blob = new Blob([image.data], { type: image.type });
          setSrc(URL.createObjectURL(blob));
        } else if (props.image) {
          // Cordova path cannot be absolute
          const image =
            isCordova() && props.image && props.image.search('/') === 0
              ? `.${props.image}`
              : props.image;

          setSrc(image);
        }
      }

      getSrc();
    },
    [keyPath, setSrc, props.image]
  );

  const symbolClassName = classNames('Symbol', className);

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault(); //prevent new line in next textArea
      return;
    }
  };

  let labelRender = label;

  if (labelCase === LABEL_CASE_LOWER) {
    labelRender = label.toLowerCase();
  } else if (labelCase === LABEL_CASE_UPPER) {
    labelRender = label.toUpperCase();
  } else {
    labelRender = label;
  }

  return (
    <div className={symbolClassName} image={src} {...other}>
      {props.type === 'live' && (
        <OutlinedInput
          id="outlined-live-input"
          margin="none"
          color="primary"
          variant="filled"
          placeholder={intl.formatMessage(messages.writeAndSay)}
          autoFocus={true}
          multiline
          rows={5}
          value={label}
          onChange={onWrite}
          fullWidth={true}
          onKeyPress={handleKeyPress}
          style={{
            padding: '0.5em 0.8em 0.5em 0.8em',
            height: '100%'
          }}
          className={'liveInput'}
        />
      )}
      {props.type !== 'live' &&
        props.labelpos === 'Above' &&
        props.labelpos !== 'Hidden' && (
          <Typography className="Symbol__label">{labelRender}</Typography>
        )}
      {src && (
        <div className="Symbol__image-container">
          <img className="Symbol__image" src={src} alt="" />
        </div>
      )}
      {props.type !== 'live' &&
        props.labelpos === 'Below' &&
        props.labelpos !== 'Hidden' && (
          <Typography className="Symbol__label">{labelRender}</Typography>
        )}
    </div>
  );
}
Symbol.propTypes = propTypes;
Symbol.defaultProps = {
  labelpos: LABEL_POSITION_BELOW,
  labelCase: LABEL_CASE_DEFAULT
};

export default Symbol;
