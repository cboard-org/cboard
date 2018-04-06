import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import messages from './SelectedCounter.messages';
import './SelectedCounter.css';

const propTypes = {
  count: PropTypes.number
};

const defaultProps = {
  count: 0
};

const SelectedCounter = ({ count }) => (
  <div className="SelectedCounter">
    {count} <FormattedMessage {...messages.itemsSelected} />
  </div>
);

SelectedCounter.propTypes = propTypes;
SelectedCounter.defaultProps = defaultProps;

export default SelectedCounter;
