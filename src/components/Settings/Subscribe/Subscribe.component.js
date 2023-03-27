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
   * Name of user
   */
  name: PropTypes.string.isRequired,
  /**
   * User email
   */
  email: PropTypes.string.isRequired,
  /**
   * Handle refresh subscription
   */
  onRefreshSubscription: PropTypes.func
};

const defaultProps = {
  name: '',
  email: '',
  location: { country: null, countryCode: null }
};

const Subscribe = ({
  onClose,
  isLogged,
  onSubscribe,
  name,
  email,
  location: { country, countryCode },
  onSubmitPeople,
  products,
  subscription,
  onRefreshSubscription
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
            products={products}
            onRefreshSubscription={onRefreshSubscription}
            isLogged={isLogged}
            onSubscribe={onSubscribe}
          />
        ) : (
          <SubscriptionInfo onRefreshSubscription={onRefreshSubscription} />
        )}
      </FullScreenDialog>
    </div>
  );
};

Subscribe.propTypes = propTypes;
Subscribe.defaultProps = defaultProps;

export default Subscribe;
