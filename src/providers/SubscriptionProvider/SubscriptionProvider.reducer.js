import {
  UPDATE_PRODUCT_STATE,
  UPDATE_SUBSCRIBER_ID,
  UPDATE_IS_SUBSCRIBED,
  UPDATE_SUBSCRIPTION,
  SHOW_PREMIUM_REQUIRED,
  HIDE_PREMIUM_REQUIRED
} from './SubscriptionProvider.constants';

const initialState = {
  subscriberId: '',
  androidSubscriptionState: 'not_subscribed',
  isSubscribed: false,
  expiryDate: null,
  premiumRequiredModalState: {
    open: false,
    isTryPeriodFinished: false
  }
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
    case SHOW_PREMIUM_REQUIRED:
      return {
        ...state,
        premiumRequiredModalState: {
          open: true,
          isTryPeriodFinished: action.isTryPeriodFinished
        }
      };
    case HIDE_PREMIUM_REQUIRED:
      return {
        ...state,
        premiumRequiredModalState: {
          open: false,
          isTryPeriodFinished: false
        }
      };
    default:
      return state;
  }
}

export default subscriptionProviderReducer;
