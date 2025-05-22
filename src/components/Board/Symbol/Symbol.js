import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isCordova } from '../../../cordova-util';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import messages from '../Board.messages';

import { LABEL_POSITION_BELOW } from '../../Settings/Display/Display.constants';
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
  type: PropTypes.string,
  onWrite: PropTypes.func,
  intl: PropTypes.object
};

function useCheckSrc(src, setIsLoading) {
  useEffect(
    () => {
      if (!src) return;
      setIsLoading(true);
      const img = new Image();
      img.src = src;

      if (img.complete) {
        setIsLoading(false);
      } else {
        img.onload = () => setIsLoading(false);
        img.onerror = () => setIsLoading(false);
        img.onabort = () => setIsLoading(false);
      }
    },
    [src, setIsLoading]
  );
}

function Symbol(props) {
  const {
    className,
    label,
    labelpos,
    keyPath,
    type,
    onWrite,
    intl,
    image,
    ...other
  } = props;
  const [src, setSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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
          const url = URL.createObjectURL(blob);
          setSrc(url);
          return;
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

  useCheckSrc(src, setIsLoading);

  const symbolClassName = classNames('Symbol', className);

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault(); //prevent new line in next textArea
      return;
    }
  };

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
          <Typography className="Symbol__label">{label}</Typography>
        )}
      {src && (
        <div className="Symbol__image-container">
          {isLoading ? (
            <div className="Symbol__image-loading" />
          ) : (
            <img alt="" className="Symbol__image" src={src} />
          )}
        </div>
      )}
      {props.type !== 'live' &&
        props.labelpos === 'Below' &&
        props.labelpos !== 'Hidden' && (
          <Typography className="Symbol__label">{label}</Typography>
        )}
    </div>
  );
}
Symbol.propTypes = propTypes;
Symbol.defaultProps = {
  labelpos: LABEL_POSITION_BELOW
};

export default Symbol;
