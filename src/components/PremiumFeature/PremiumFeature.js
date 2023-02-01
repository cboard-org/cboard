import React from 'react';
import { connect } from 'react-redux';
import { showPremiumRequired } from '../../providers/SubscriptionProvider/SubscriptionProvider.actions';

function PremiumFeature(props) {
  const captured = event => {
    if (!props.isSubscribed) {
      event.stopPropagation();
      props.showPremiumRequired();
    }
  };

  console.log(props.children);
  return (
    <>
      <div onClickCapture={captured}>{props.children}</div>
    </>
  );
}

const mapStateToProps = state => ({
  isSubscribed: state.subscription.isSubscribed
});

const mapDispatchToProps = { showPremiumRequired };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PremiumFeature);
