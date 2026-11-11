import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import EmailIcon from '@material-ui/icons/Email';

import ClientStatusChip from './ClientStatusChip';
import { formatDate } from './ExpiredAlerts';
import { isClientPaused } from './accessGates';
import { ACCESS_SUPPORT_EMAIL_URL } from '../../../constants';
import messages from './AccessDashboard.messages';

import '../Settings.css';

const getSecondary = (intl, client) => {
  const date = formatDate(intl, client.subscriptionEnd);
  if (client.isExpired) {
    return [
      intl.formatMessage(messages.expiredOn, { date }),
      intl.formatMessage(messages.qrPaused)
    ].join(' · ');
  }
  const parts = [intl.formatMessage(messages.validUntil, { date })];
  parts.push(
    isClientPaused(client)
      ? intl.formatMessage(messages.qrPaused)
      : intl.formatMessage(messages.qrCodesCount, {
          count: client.accessGates.length
        })
  );
  return parts.join(' · ');
};

const PlanView = ({ intl, clients }) => (
  <>
    <Paper className="Settings__section">
      <List>
        {clients.map((client, index) => (
          <Fragment key={client.slug}>
            <ListItem>
              <ListItemText
                primary={client.clientName}
                secondary={getSecondary(intl, client)}
              />
              <ListItemSecondaryAction className="Settings__section--secondaryAction">
                <ClientStatusChip intl={intl} client={client} showExpired />
              </ListItemSecondaryAction>
            </ListItem>
            {index !== clients.length - 1 && <Divider />}
          </Fragment>
        ))}
      </List>
    </Paper>
    <Typography variant="body2" color="textSecondary" gutterBottom>
      {intl.formatMessage(messages.planFootnote)}
    </Typography>
    <Button
      color="primary"
      variant="outlined"
      startIcon={<EmailIcon />}
      href={ACCESS_SUPPORT_EMAIL_URL}
    >
      {intl.formatMessage(messages.contactSupport)}
    </Button>
  </>
);

PlanView.propTypes = {
  intl: intlShape.isRequired,
  clients: PropTypes.array.isRequired
};

export default PlanView;
