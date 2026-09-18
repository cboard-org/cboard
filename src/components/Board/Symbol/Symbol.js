import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isPackagedApp } from '../../../cordova-util';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import messages from '../Board.messages';

import { LABEL_POSITION_BELOW } from '../../Settings/Display/Display.constants';
import './Symbol.css';
import { Typography } from '@material-ui/core';
import {
  getStoredImageUrl,
  releaseStoredImageUrl,
  isRemote
} from '../../../idb/media/storedImageUrls';
import { storeRemoteImage } from '../../../idb/media/remoteImageLoader';

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
  intl: PropTypes.object,
  /**
   * Keep a remote image on-device so it still renders offline. Opt-in, and only for
   * images already committed to a board: anywhere a user merely browses images
   * (search results, tile editor previews) every image passed through would be
   * stored forever. A tile saved in the editor is cached once the board renders it.
   */
  cacheRemoteImage: PropTypes.bool
};

function formatSrc(src) {
  return isPackagedApp() && src?.startsWith('/') ? `.${src}` : src;
}

function SymbolImage({ image, keyPath, cacheRemoteImage }) {
  const [src, setSrc] = useState(image ? formatSrc(image) : '');
  const mounted = useRef(true);
  // Holds the promise once acquired, so a retry within the same mount (e.g. a
  // second onError) reuses it instead of acquiring -- and reading IndexedDB
  // -- a second time.
  const acquired = useRef(null);

  useEffect(
    () => () => {
      mounted.current = false;
      if (acquired.current) releaseStoredImageUrl(image, keyPath);
    },
    [image, keyPath]
  );

  const showStoredImage = useCallback(async () => {
    if (!acquired.current) acquired.current = getStoredImageUrl(image, keyPath);

    const url = await acquired.current;
    // A hit paints the stored copy; a miss hides the tile rather than leave a
    // broken icon behind forever, since nothing will make this <img> retry on
    // its own once its src stops changing.
    if (mounted.current) setSrc(url ?? '');
  }, [image, keyPath]);

  useEffect(() => {
    if (!image && keyPath) showStoredImage();
  }, [image, keyPath, showStoredImage]);

  // A tile that goes blank offline never gets another chance to load: its src
  // does not change again, so onError cannot re-fire on its own. Reconnecting
  // is the only other trigger that can repaint it with the remote url.
  useEffect(() => {
    if (!isRemote(image)) return undefined;

    const handleOnline = () => {
      if (!src) setSrc(formatSrc(image));
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [image, src]);

  const handleLoad = () => {
    if (!cacheRemoteImage || !isRemote(image) || src !== formatSrc(image)) {
      return;
    }
    storeRemoteImage(image);
  };

  if (!src) return null;

  return (
    <img
      className="Symbol__image"
      src={src}
      alt=""
      onError={showStoredImage}
      onLoad={handleLoad}
    />
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
    cacheRemoteImage,
    ...other
  } = props;

  const symbolClassName = classNames('Symbol', className);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); //prevent new line in next textArea
      return;
    }
  };

  return (
    <div className={symbolClassName} {...other}>
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

      <div className="Symbol__image-container">
        <SymbolImage
          key={image || keyPath}
          image={image}
          keyPath={keyPath}
          cacheRemoteImage={cacheRemoteImage}
        />
      </div>

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
