import {
  QUEUE_EVENT,
  REMOVE_EVENTS,
  INCREMENT_RETRY,
  CLEAR_QUEUE
} from './CommunicationQueue.constants';

const MAX_QUEUE_SIZE = 500;

const initialState = {
  events: []
};

function communicationQueueReducer(state = initialState, action) {
  switch (action.type) {
    case QUEUE_EVENT: {
      const updatedEvents = [...state.events, action.payload];

      return {
        ...state,
        events: updatedEvents.slice(-MAX_QUEUE_SIZE)
      };
    }

    case REMOVE_EVENTS:
      return {
        ...state,
        events: state.events.filter(
          event => !action.payload.includes(event.id)
        )
      };

    case INCREMENT_RETRY:
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload
            ? {
                ...event,
                retryCount: (event.retryCount || 0) + 1,
                nextRetryAt:
                  Date.now() +
                  Math.min(1000 * 2 ** ((event.retryCount || 0) + 1), 60000)
              }
            : event
        )
      };

    case CLEAR_QUEUE:
      return {
        ...state,
        events: []
      };

    default:
      return state;
  }
}

export default communicationQueueReducer;
