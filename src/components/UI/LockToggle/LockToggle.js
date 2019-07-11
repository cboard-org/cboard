import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockOpenIcon from '@material-ui/icons/LockOpen';

import withChildProof from './childProof';
import IconButton from '../IconButton';
import messages from './LockToggle.messages';

const propTypes = {
  /**
   * @ignore
   */
  intl: intlShape.isRequired,
  /**
   * If true, toggle will be locked
   */
  locked: PropTypes.bool
};

function LockToggle(props) {
  const { intl, locked, ...rest } = props;

  const lockButtonLabel = locked
    ? intl.formatMessage(messages.unlock)
    : intl.formatMessage(messages.lock);

  return (
    <IconButton label={lockButtonLabel} {...rest}>
      {locked ? <LockOutlinedIcon /> : <LockOpenIcon />}
    </IconButton>
  );
}

LockToggle.propTypes = propTypes;

const ChildProofLockToggle = withChildProof(LockToggle);

export default injectIntl(ChildProofLockToggle);
