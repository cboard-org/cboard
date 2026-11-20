import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isPackagedApp } from '../../../cordova-util';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import messages from '../Board.messages';

import { LABEL_POSITION_BELOW } from '../../Settings/Display/Display.constants';
import './Symbol.css';
import { Typography } from '@material-ui/core';
import {
  acquireStoredImageUrl,
  dropStoredImageMisses
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

const isRemote = (src) => /^https?:\/\//.test(src ?? '');

function SymbolImage({ image, keyPath, cacheRemoteImage }) {
  const remoteSrc = image ? formatSrc(image) : '';
  const [src, setSrc] = useState(remoteSrc);
  const [loaded, setLoaded] = useState(false);
  const [hideUntilLoaded, setHideUntilLoaded] = useState(
    () => isRemote(image) && !navigator.onLine
  );
  const releaseStoredUrl = useRef(null);
  const usingStoredUrl = useRef(false);
  const mounted = useRef(true);

  useEffect(
    () => () => {
      mounted.current = false;
      if (releaseStoredUrl.current) {
        releaseStoredUrl.current();
        releaseStoredUrl.current = null;
      }
    },
    []
  );

  useEffect(() => {
    if (src || usingStoredUrl.current || (!image && !keyPath)) return undefined;

    let cancelled = false;
    const { promise, release } = acquireStoredImageUrl(image, keyPath);
    releaseStoredUrl.current = release;

    promise.then((url) => {
      if (cancelled || !mounted.current) return;
      if (!url) {
        release();
        if (releaseStoredUrl.current === release) {
          releaseStoredUrl.current = null;
        }
        return;
      }
      usingStoredUrl.current = true;
      setSrc(url);
    });

    return () => {
      cancelled = true;
      if (!usingStoredUrl.current && releaseStoredUrl.current === release) {
        release();
        releaseStoredUrl.current = null;
      }
    };
  }, [src, image, keyPath]);

  useEffect(() => {
    if (src || !isRemote(image)) return undefined;

    const handleOnline = () => {
      dropStoredImageMisses();
      setHideUntilLoaded(false);
      setLoaded(false);
      setSrc(remoteSrc);
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [src, image, remoteSrc]);

  const handleLoad = () => {
    if (hideUntilLoaded && !loaded) setLoaded(true);
    if (usingStoredUrl.current || !cacheRemoteImage || !isRemote(image)) return;
    storeRemoteImage(image);
  };

  const handleError = () => setSrc('');

  if (!src) return null;

  return (
    <img
      className="Symbol__image"
      src={src}
      alt=""
      style={
        hideUntilLoaded && !loaded && src === remoteSrc
          ? { visibility: 'hidden' }
          : undefined
      }
      onError={handleError}
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
