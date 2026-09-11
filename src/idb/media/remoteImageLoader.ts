import { getCachedImage, putCachedImage } from './imageCache';

const handled = new Set<string>();

const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

// a 200 that is not an image is a captive portal or an error page, and becomes a
// real image once the network does; a 404 or a 403 stays what it is
const isRetryable = (response: Response): boolean =>
  response.ok || RETRYABLE_STATUS.has(response.status);

export async function storeRemoteImage(url: string): Promise<void> {
  if (handled.has(url) || !navigator.onLine) return;
  handled.add(url);

  try {
    if (await getCachedImage(url)) return;
    const response = await fetch(url);
    const type = response.headers.get('content-type') || '';
    if (!response.ok || !type.startsWith('image/')) {
      if (isRetryable(response)) handled.delete(url);
      return;
    }

    await putCachedImage({ url, type, data: await response.arrayBuffer() });
  } catch (error) {
    handled.delete(url);
  }
}
