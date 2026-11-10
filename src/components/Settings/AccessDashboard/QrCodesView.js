import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import QrCodeIcon from '@material-ui/icons/CropFree';

import { ItemCard } from '../../UI/Dashboard';
import ClientStatusChip from './ClientStatusChip';
import messages from './AccessDashboard.messages';

const QrCodesView = ({ intl, items, selectedKey, onSelect }) => (
  <Grid container spacing={2}>
    {items.map(({ key, client, gate }) => (
      <Grid item xs={12} sm={6} md={6} lg={4} key={key}>
        <ItemCard
          title={client.clientName}
          meta={[gate.code, gate.rootBoard && gate.rootBoard.name]}
          caption={intl.formatMessage(messages.scans, {
            count: gate.viewsCount
          })}
          thumb={{
            src: gate.qrCodeUrl,
            alt: gate.code,
            icon: QrCodeIcon
          }}
          status={<ClientStatusChip intl={intl} client={client} />}
          selected={selectedKey === key}
          onSelect={() => onSelect(key)}
        />
      </Grid>
    ))}
  </Grid>
);

QrCodesView.propTypes = {
  intl: intlShape.isRequired,
  items: PropTypes.array.isRequired,
  selectedKey: PropTypes.string,
  onSelect: PropTypes.func.isRequired
};

export default QrCodesView;
