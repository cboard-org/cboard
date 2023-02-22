import React from 'react';
import { connect } from 'react-redux';
import { showPremiumRequired } from '../../providers/SubscriptionProvider/SubscriptionProvider.actions';

function PremiumFeature({
  children,
  isOnTrialPeriod,
  isSubscribed,
  isInFreeCountry,
  showPremiumRequired
}) {
  const captured = event => {
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
  isInFreeCountry: state.subscription.isInFreeCountry
});

const mapDispatchToProps = { showPremiumRequired };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PremiumFeature);
