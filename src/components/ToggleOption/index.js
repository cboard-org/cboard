/**
*
* ToggleOption
*
*/

import React from 'react';
import { injectIntl, intlShape } from 'react-intl';

const ToggleOption = ({ value, text, message, intl }) => (
  <option value={value}>
    {message ? intl.formatMessage(message) : text}
  </option>
);

ToggleOption.propTypes = {
  value: React.PropTypes.string.isRequired,
  message: React.PropTypes.object,
  intl: intlShape.isRequired,
};

export default injectIntl(ToggleOption);
