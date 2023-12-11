import React from 'react';
import { connect } from 'react-redux';
import { isLogged } from '../App/App.selectors';

function LoggedInFeature({
  children,
  isLogged,
  isInFreeCountry
  // isOnTrialPeriod,
  // isSubscribed,
  // showPremiumRequired,
  // lastUpdated
}) {
  const captured = event => {
    if (isLogged && isInFreeCountry) {
      return;
    }
    // event.stopPropagation();
    // event.preventDefault();

    console.log('show modal');
    // if (isUpdateSubscriberStatusNeeded(lastUpdated)) {
    //   const requestOrigin = 'Function: captured - Component: PremiumFeature';
    //   updateIsSubscribed(requestOrigin);
    //   updateIsInFreeCountry();
    //   updateIsOnTrialPeriod();
    // }

    // if (isInFreeCountry || isSubscribed || isOnTrialPeriod) return;
    // event.stopPropagation();
    // event.preventDefault();
    // showPremiumRequired();
  };
  return (
    <>
      <div onClickCapture={captured}>logged in feature{children}</div>
    </>
  );
}

const mapStateToProps = state => ({
  isLogged: isLogged(state),
  isOnTrialPeriod: state.subscription.isOnTrialPeriod,
  isSubscribed: state.subscription.isSubscribed,
  isInFreeCountry: state.subscription.isInFreeCountry,
  lastUpdated: state.subscription.lastUpdated
});

const mapDispatchToProps = {
  // showPremiumRequired,
  // updateIsSubscribed,
  // updateSubscription,
  // updateIsInFreeCountry
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoggedInFeature);
