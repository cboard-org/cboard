import {
  UPDATE_PRODUCT_STATE,
  UPDATE_SUBSCRIBER_ID,
  UPDATE_IS_SUBSCRIBED,
  UPDATE_SUBSCRIPTION
} from './SubscriptionProvider.constants';
import { LOGOUT } from '../../components/Account/Login/Login.constants';

const initialState = {
  subscriberId: '',
  androidSubscriptionState: 'not_subscribed',
  isSubscribed: false,
  expiryDate: null
};

function subscriptionProviderReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PRODUCT_STATE:
      return {
        ...state,
        productState: action.payload
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
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default subscriptionProviderReducer;
