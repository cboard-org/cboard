import { getStore } from '../configureStore';

const FLUSH_INTERVAL = 15000;
const BATCH_SIZE = 25;

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
  const store = getStore();

  if (!store) {
    return;
  }

  const state = store.getState();

  const queuedEvents = state.communicationQueue?.events || [];

  if (!queuedEvents.length) {
    return;
  }

  const batch = queuedEvents.slice(0, BATCH_SIZE);

  try {
    console.log('Flushing communication events:', batch);

    // API request will go here later

  } catch (error) {
    console.error('Failed to flush communication queue', error);
  }
}
