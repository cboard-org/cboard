import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import AnalyticsIcon from '@material-ui/icons/BarChart';

import IconButton from '../IconButton';
import messages from '../../Analytics/Analytics.messages';

const propTypes = {
  /**
   * The component used for the root node. Either a string to use a DOM element or a component.
   */
  component: PropTypes.object,
  /**
   * If true, back button is disabled
   */
  disabled: PropTypes.bool,
  /**
   * @ignore
   */
  intl: intlShape.isRequired,
  /**
   * Callback fired when back button is clicked
   */
  onClick: PropTypes.func
};

function AnalyticsButton(props) {
  const { intl, ...other } = props;
  const label = intl.formatMessage(messages.analytics);

  return (
    <IconButton label={label} {...other}>
      <AnalyticsIcon />
    </IconButton>
  );
}

AnalyticsButton.propTypes = propTypes;

export default injectIntl(AnalyticsButton);
