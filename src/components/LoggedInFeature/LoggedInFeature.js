import React from 'react';
import { connect } from 'react-redux';
import { isLogged } from '../App/App.selectors';
import { showLoginRequired } from '../../providers/SubscriptionProvider/SubscriptionProvider.actions';

function LoggedInFeature({
  children,
  isLogged,
  isInFreeCountry,
  showLoginRequired
}) {
  const captured = event => {
    if (isLogged && isInFreeCountry) {
      return;
    }
    console.log('show modal');
    event.stopPropagation();
    event.preventDefault();
    showLoginRequired();
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
  showLoginRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoggedInFeature);
