import React from 'react';

import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Subscribe.messages';
import './Subscribe.css';

import SubscriptionInfo from './SubscriptionInfo';
import SubscriptionPlans from './SubscriptionPlans';

const propTypes = {
  /**
   * Callback fired when clicking the back button
   */
  onClose: PropTypes.func,
  /**
   * Callback fired when clicking the subscribe button
   */
  onSubscribe: PropTypes.func.isRequired,
  /**
   * flag for user
   */
  isLogged: PropTypes.bool.isRequired,
  /**
   * Handle refresh subscription
   */
  onRefreshSubscription: PropTypes.func,
  onSubscribeCancel: PropTypes.func.isRequired,
  onCancelSubscription: PropTypes.func.isRequired,
  cancelSubscriptionStatus: PropTypes.string.isRequired
};

const defaultProps = {
  location: { country: null, countryCode: null }
};

const Subscribe = ({
  onClose,
  isLogged,
  onSubscribe,
  location: { country, countryCode },
  subscription,
  onRefreshSubscription,
  onSubscribeCancel,
  onPaypalApprove,
  onCancelSubscription,
  cancelSubscriptionStatus
}) => {
  return (
    <div className="Subscribe">
      <FullScreenDialog
        open
        title={<FormattedMessage {...messages.subscribe} />}
        onClose={onClose}
        // fullWidth
      >
        {!subscription.isSubscribed ? (
          <SubscriptionPlans
            subscription={subscription}
            onRefreshSubscription={onRefreshSubscription}
            isLogged={isLogged}
            onSubscribe={onSubscribe}
            onSubscribeCancel={onSubscribeCancel}
            onPaypalApprove={onPaypalApprove}
          />
        ) : (
          <SubscriptionInfo
            onRefreshSubscription={onRefreshSubscription}
            onCancelSubscription={onCancelSubscription}
            cancelSubscriptionStatus={cancelSubscriptionStatus}
          />
        )}
      </FullScreenDialog>
    </div>
  );
};

Subscribe.propTypes = propTypes;
Subscribe.defaultProps = defaultProps;

export default Subscribe;
