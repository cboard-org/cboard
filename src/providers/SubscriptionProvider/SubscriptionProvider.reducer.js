import {
  UPDATE_ANDROID_SUBSCRIPTION_STATE,
  UPDATE_SUBSCRIBER_ID,
  UPDATE_IS_SUBSCRIBED,
  UPDATE_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION_ERROR
} from './SubscriptionProvider.constants';
import { LOGOUT } from '../../components/Account/Login/Login.constants';

const initialState = {
  subscriberId: '',
  androidSubscriptionState: 'not_subscribed',
  isSubscribed: false,
  expiryDate: null,
  error: {
    isError: false,
    code: '',
    message: ''
  }
};

function subscriptionProviderReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ANDROID_SUBSCRIPTION_STATE:
      return {
        ...state,
        androidSubscriptionState: action.payload
      };
    case UPDATE_SUBSCRIBER_ID:
      return {
        ...state,
        subscriberId: action.payload
      };
    case UPDATE_IS_SUBSCRIBED:
      return {
        ...state,
        isSubscribed: action.payload
      };
    case UPDATE_SUBSCRIPTION:
      const {
        expiryDate,
        isSubscribed,
        androidSubscriptionState
      } = action.payload;
      return {
        ...state,
        expiryDate,
        isSubscribed,
        androidSubscriptionState
      };
    case UPDATE_SUBSCRIPTION_ERROR:
      const { showError, code, message } = action.payload;
      return {
        ...state,
        error: {
          showError: showError,
          code: code,
          message: message
        }
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default subscriptionProviderReducer;
