import {
  QUEUE_EVENT,
  REMOVE_EVENTS,
  INCREMENT_RETRY,
  CLEAR_QUEUE
} from './CommunicationQueue.constants';

export const queueEvent = payload => ({
  type: QUEUE_EVENT,
  payload
});

export const removeEvents = eventIds => ({
  type: REMOVE_EVENTS,
  payload: eventIds
});

export const incrementRetry = eventId => ({
  type: INCREMENT_RETRY,
  payload: eventId
});

export const clearQueue = () => ({
  type: CLEAR_QUEUE
});
