import { isLogged } from '../../components/App/App.selectors';
import { hasCurrentSubscription } from './SubscriptionProvider.helpers';

export const isSubscriptionRequired = (state) => {
  if (!isLogged(state)) {
    return false;
  }

  const { isInFreeCountry, isOnTrialPeriod } = state.subscription;
  const isSubscribed = hasCurrentSubscription(state.subscription);
  return !isInFreeCountry && !isSubscribed && !isOnTrialPeriod;
};
