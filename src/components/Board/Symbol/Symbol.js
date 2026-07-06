import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isCordova } from '../../../cordova-util';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import messages from '../Board.messages';

import { LABEL_POSITION_BELOW } from '../../Settings/Display/Display.constants';
import './Symbol.css';
import { Typography } from '@material-ui/core';
import { getArasaacDB } from '../../../idb/arasaac/arasaacdb';
import {
  getCachedImage,
  putCachedImage
} from '../../../idb/imageCache/imageCache';

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

function formatSrc(src) {
  return isCordova() && src?.startsWith('/') ? `.${src}` : src;
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

  const [src, setSrc] = useState(image ? formatSrc(image) : '');
  const objectUrlRef = useRef(null);

  const fetchArasaacImagefromIndexedDB = useCallback(async id => {
    if (!id) return null;

    try {
      const arasaacDB = getArasaacDB();
      return await arasaacDB.getImageById(id);
    } catch (error) {
      console.error('Failed to fetch Arasaac image from Indexed DB:', error);
      return null;
    }
  }, []);

  useEffect(
    () => {
      let cancelled = false;

      async function getSrc() {
        const setBlobSrc = (data, type) => {
          const blob = new Blob([data], { type });
          const url = URL.createObjectURL(blob);
          if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
          }
          objectUrlRef.current = url;
          setSrc(url);
        };

        const imageFromIndexedDb = await fetchArasaacImagefromIndexedDB(
          keyPath
        );

        if (cancelled) return;

        if (imageFromIndexedDb) {
          setBlobSrc(imageFromIndexedDb.data, imageFromIndexedDb.type);
          return;
        }

        // Cache remote symbol images (e.g. globalsymbols.com) on-device so they
        // still render offline. Service workers don't run in the Cordova webview,
        // so IndexedDB is the only durable cache on native.
        if (image && /^https?:\/\//.test(image)) {
          const cached = await getCachedImage(image);
          if (cancelled) return;

          if (cached) {
            setBlobSrc(cached.data, cached.type);
            return;
          }

          setSrc(formatSrc(image));

          if (navigator.onLine) {
            try {
              const res = await fetch(image);
              if (res.ok) {
                const data = await res.arrayBuffer();
                await putCachedImage({
                  url: image,
                  type: res.headers.get('content-type') || 'image/png',
                  data
                });
              }
            } catch (e) {
              // offline or CORS-blocked: keep the network src, retry next render
            }
          }
          return;
        }

        if (image) {
          setSrc(formatSrc(image));
          return;
        }

        setSrc('');
      }
      getSrc();

      return () => {
        cancelled = true;
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = null;
        }
      };
    },
    [fetchArasaacImagefromIndexedDB, image, keyPath]
  );

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

      <div className="Symbol__image-container">
        {src && <img className="Symbol__image" src={src} alt="" />}
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
