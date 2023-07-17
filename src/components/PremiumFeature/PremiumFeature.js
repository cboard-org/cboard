import React from 'react';
import { connect } from 'react-redux';
import {
  updateIsInFreeCountry,
  updateIsSubscribed,
  updateSubscription,
  updateIsOnTrialPeriod,
  showPremiumRequired
} from '../../providers/SubscriptionProvider/SubscriptionProvider.actions';

function isUpdateSubscriberStatusNeeded(lastUpdated) {
  if (!lastUpdated) return true;
  const MAX_HOURS_DIFFERENCE = 12;
  const actualTime = new Date().getTime();
  const difference = actualTime - lastUpdated;
  const hoursDifference = difference / (1000 * 60 * 60);
  return hoursDifference > MAX_HOURS_DIFFERENCE;
}

function PremiumFeature({
  children,
  isOnTrialPeriod,
  isSubscribed,
  isInFreeCountry,
  showPremiumRequired,
  lastUpdated
}) {
  const captured = event => {
    if (isUpdateSubscriberStatusNeeded(lastUpdated)) {
      const requestOrigin = 'Function: captured - Component: PremiumFeature';
      updateIsSubscribed(requestOrigin);
      updateIsInFreeCountry();
      updateIsOnTrialPeriod();
    }

    if (isInFreeCountry || isSubscribed || isOnTrialPeriod) return;
    event.stopPropagation();
    event.preventDefault();
    showPremiumRequired();
  };

  return (
    <>
      <div onClickCapture={captured}>{children}</div>
    </>
  );
}

const mapStateToProps = state => ({
  isOnTrialPeriod: state.subscription.isOnTrialPeriod,
  isSubscribed: state.subscription.isSubscribed,
  isInFreeCountry: state.subscription.isInFreeCountry,
  lastUpdated: state.subscription.lastUpdated
});

const mapDispatchToProps = {
  showPremiumRequired,
  updateIsSubscribed,
  updateSubscription,
  updateIsInFreeCountry
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PremiumFeature);
