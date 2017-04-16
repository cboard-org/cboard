/**
*
* ToggleOption
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

const ToggleOption = ({ value, text, message, intl }) => (
  <option value={value}>
    {message ? intl.formatMessage(message) : text}
  </option>
);

ToggleOption.propTypes = {
  value: PropTypes.string.isRequired,
  message: PropTypes.object,
  intl: intlShape.isRequired,
};

export default injectIntl(ToggleOption);
