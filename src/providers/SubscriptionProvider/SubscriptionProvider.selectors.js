export const isSubscriptionRequired = state => {
  const { isInFreeCountry, isSubscribed, isOnTrialPeriod } = state.subscription;
  return !isInFreeCountry && !isSubscribed && !isOnTrialPeriod;
};
