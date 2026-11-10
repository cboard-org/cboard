import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';

import TonalChip from '../../UI/TonalChip';
import { isClientPaused } from './accessGates';
import messages from './AccessDashboard.messages';

const ClientStatusChip = ({ intl, client, showExpired }) => {
  if (!isClientPaused(client)) {
    return (
      <TonalChip
        tone="success"
        icon={<CheckCircleIcon />}
        label={intl.formatMessage(messages.statusActive)}
      />
    );
  }

  const label =
    showExpired && client.isExpired
      ? messages.statusExpired
      : messages.statusPaused;

  return (
    <TonalChip
      tone="error"
      icon={<PauseCircleFilledIcon />}
      label={intl.formatMessage(label)}
    />
  );
};

ClientStatusChip.defaultProps = {
  showExpired: false
};

ClientStatusChip.propTypes = {
  intl: intlShape.isRequired,
  client: PropTypes.object.isRequired,
  showExpired: PropTypes.bool
};

export default ClientStatusChip;
