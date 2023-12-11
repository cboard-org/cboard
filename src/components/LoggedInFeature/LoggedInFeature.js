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
    if (!isLogged && isInFreeCountry) {
      event.stopPropagation();
      event.preventDefault();
      showLoginRequired();
    }
  };
  return (
    <>
      <div onClickCapture={captured}>{children}</div>
    </>
  );
}

const mapStateToProps = state => ({
  isLogged: isLogged(state),
  isInFreeCountry: state.subscription.isInFreeCountry
});

const mapDispatchToProps = {
  showLoginRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoggedInFeature);
