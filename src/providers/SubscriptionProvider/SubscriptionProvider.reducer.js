import {
  UPDATE_SUBSCRIBER_ID,
  UPDATE_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION_ERROR,
  SHOW_PREMIUM_REQUIRED,
  HIDE_PREMIUM_REQUIRED,
  NOT_SUBSCRIBED
} from './SubscriptionProvider.constants';
import {
  LOGOUT,
  LOGIN_SUCCESS
} from '../../components/Account/Login/Login.constants';

const initialState = {
  subscriberId: '',
  status: NOT_SUBSCRIBED,
  isSubscribed: false,
  expiryDate: null,
  error: {
    isError: false,
    code: '',
    message: ''
  },
  isInFreeCountry: true,
  isOnTrialPeriod: true,
  premiumRequiredModalState: {
    open: false,
    showTryPeriodFinishedMessages: false
  },
  ownedProduct: '',
  products: [
    {
      id: '',
      subscriptionId: '',
      title: '',
      billingPeriod: '',
      price: '',
      tag: ''
    }
  ]
};

function subscriptionProviderReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SUBSCRIBER_ID:
      return {
        ...state,
        subscriberId: action.payload
      };
    case UPDATE_SUBSCRIPTION:
      return {
        ...state,
        ...action.payload
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
    case LOGIN_SUCCESS:
      const subscriber = action.payload.subscriber || {};
      const {
        id = '',
        status = NOT_SUBSCRIBED,
        expiryDate: expiry = null
      } = subscriber;

      return {
        ...state,
        subscriberId: id,
        status: status,
        expiryDate: expiry
      };
    case LOGOUT:
      return initialState;
    case SHOW_PREMIUM_REQUIRED:
      return {
        ...state,
        premiumRequiredModalState: {
          open: true,
          showTryPeriodFinishedMessages: action.showTryPeriodFinishedMessages
        }
      };
    case HIDE_PREMIUM_REQUIRED:
      return {
        ...state,
        premiumRequiredModalState: {
          open: false,
          showTryPeriodFinishedMessages:
            state.premiumRequiredModalState.showTryPeriodFinishedMessages
        }
      };
    default:
      return state;
  }
}

export default subscriptionProviderReducer;
