import { QUEUE_EVENT } from './CommunicationQueue.constants';

export const queueEvent = payload => ({
  type: QUEUE_EVENT,
  payload
});
