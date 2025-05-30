import { getArasaacDB } from '../../../idb/arasaac/arasaacdb';
import { isCordova } from '../../../cordova-util';
import { useEffect, useState, useCallback, useRef } from 'react';

export default function useGetSymbolSrc(
  imageSrc?: string,
  keyPath?: string
): string {
  const [src, setSrc] = useState<string>(imageSrc ? formatSrc(imageSrc) : '');

  const objectUrlRef = useRef<string | null>(null);

  const getArasaacImageByKeyPath = useCallback(async (keyPath: string): Promise<string> => {
    try {
      const arasaacDB = getArasaacDB();
      const image = await arasaacDB.getImageById(keyPath);
      if (image) {
        const blob = new Blob([image.data], { type: image.type });
        return URL.createObjectURL(blob);
      }

      return '';
    } catch (err) {
      console.error('Error loading Arasaac image:', err);
      return '';
    }
  }, []);

  useEffect(() => {
    async function setArasaacImageSrc(keyPath: string): Promise<void> {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }

      const newSrc = await getArasaacImageByKeyPath(keyPath);
      if (newSrc) {
        objectUrlRef.current = newSrc;
        setSrc(newSrc);
      }
    }

    if (!keyPath) return;

    setArasaacImageSrc(keyPath);

    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [keyPath, getArasaacImageByKeyPath]);

  useEffect(() => {
    if (imageSrc) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setSrc(formatSrc(imageSrc));
    }
  }, [imageSrc]);

  return src;
}

function formatSrc(src: string): string {
  return isCordova() && src?.startsWith('/') ? `.${src}` : src;
}
