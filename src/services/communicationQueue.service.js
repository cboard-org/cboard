import { getStore } from '../store';

import {
  removeEvents,
  incrementRetry
} from '../components/CommunicationQueue/CommunicationQueue.actions';

const FLUSH_INTERVAL = 15000;
const BATCH_SIZE = 25;
const MAX_RETRIES = 5;

let flushInterval = null;

export function startCommunicationQueueService() {
  if (flushInterval) {
    return;
  }

  flushInterval = setInterval(() => {
    flushQueue();
  }, FLUSH_INTERVAL);

  window.addEventListener('online', flushQueue);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushQueue();
    }
  });

  window.addEventListener('pagehide', flushQueue);
}

export async function flushQueue() {
  if (!navigator.onLine) {
    return;
  }

  const store = getStore();

  if (!store) {
    return;
  }

  const state = store.getState();

  const queuedEvents = state.communicationQueue?.events || [];

  if (!queuedEvents.length) {
    return;
  }

  const now = Date.now();

  const retryableEvents = queuedEvents.filter(
    event => !event.nextRetryAt || event.nextRetryAt <= now
  );

  const batch = retryableEvents.slice(0, BATCH_SIZE);

  if (!batch.length) {
    return;
  }

  try {
    console.log('Flushing communication events:', batch);

    // API request will go here later

    store.dispatch(removeEvents(batch.map(event => event.id)));
  } catch (error) {
    console.error('Failed to flush communication queue', error);

    batch.forEach(event => {
      if ((event.retryCount || 0) < MAX_RETRIES) {
        store.dispatch(incrementRetry(event.id));
      }
    });
  }
}
