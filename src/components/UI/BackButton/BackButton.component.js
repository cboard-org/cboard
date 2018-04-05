import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';

import IconButton from '../IconButton';
import messages from './BackButton.messages';

const propTypes = {
  intl: intlShape.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

function BackButton({ intl, disabled, onClick }) {
  const backString = intl.formatMessage(messages.back);

  return (
    <IconButton label={backString} disabled={disabled} onClick={onClick}>
      <ArrowBackIcon />
    </IconButton>
  );
}

BackButton.propTypes = propTypes;

export default injectIntl(BackButton);
