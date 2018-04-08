import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import IconButton from '../IconButton';
import messages from './BackButton.messages';
import './BackButton.css';

const propTypes = {
  intl: intlShape.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

function BackButton({ intl, disabled, onClick }) {
  const backString = intl.formatMessage(messages.back);

  return (
    <IconButton label={backString} disabled={disabled} onClick={onClick}>
      <span className="BackButton__icon">
        <ArrowBackIcon />
      </span>
    </IconButton>
  );
}

BackButton.propTypes = propTypes;

export default injectIntl(BackButton);
