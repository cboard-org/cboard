import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import { ACCESS_SUPPORT_EMAIL_URL } from '../../../constants';
import messages from './AccessDashboard.messages';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2)
  }
}));

export const formatDate = (intl, date) =>
  intl.formatDate(date, { year: 'numeric', month: 'short', day: 'numeric' });

const ExpiredAlerts = ({ intl, clients }) => {
  const classes = useStyles();
  const expired = clients.filter((client) => client.isExpired);

  if (!expired.length) {
    return null;
  }

  return (
    <div className={classes.root}>
      {expired.map((client) => (
        <Alert
          key={client.slug}
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              href={ACCESS_SUPPORT_EMAIL_URL}
            >
              {intl.formatMessage(messages.contactSupport)}
            </Button>
          }
        >
          <AlertTitle>
            {intl.formatMessage(messages.expiredTitle, {
              name: client.clientName
            })}
          </AlertTitle>
          {intl.formatMessage(messages.expiredDescription, {
            date: formatDate(intl, client.subscriptionEnd)
          })}
        </Alert>
      ))}
    </div>
  );
};

ExpiredAlerts.propTypes = {
  intl: intlShape.isRequired,
  clients: PropTypes.array.isRequired
};

export default ExpiredAlerts;
