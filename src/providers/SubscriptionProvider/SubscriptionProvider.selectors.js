import { isLogged } from '../../components/App/App.selectors';

export const isSubscriptionRequired = state => {
  if (!isLogged(state)) {
    return false;
  }

  const { isInFreeCountry, isSubscribed, isOnTrialPeriod } = state.subscription;
  return !isInFreeCountry && !isSubscribed && !isOnTrialPeriod;
};
