import React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

import { FormattedMessage } from 'react-intl';
import messages from './Subscribe.messages';

import Chip from '@material-ui/core/Chip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const subscriptionInfo = () => {
  const subscription = {
    plan: 'Premium All Features',
    status: 'active',
    planAmount: '3USD / month',
    nextPayment: '25/5/12'
  };
  return [
    <Paper elevation={3} className="Subscribe__Info">
      <Typography variant="h5">Subscription Info</Typography>
      <div className="Subscribe__Info__Container">
        <div className="Subscribe__Info__Table__Container">
          <Table aria-label="simple table">
            <TableBody>
              {Object.entries(subscription).map(row => (
                <TableRow key={row[0]}>
                  <TableCell component="th" scope="row">
                    {row[0]}
                  </TableCell>
                  <TableCell align="right">
                    {row[0] === 'status' ? (
                      <Chip
                        label={row[1]}
                        size="small"
                        color="primary"
                        style={{ backgroundColor: 'green' }}
                      />
                    ) : (
                      row[1]
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="Subscribe__Info__Button__Container">
        <Button variant="contained" fullWidth={false} color="primary">
          <FormattedMessage {...messages.manageSubscription} />
        </Button>
      </div>
    </Paper>
  ];
};

const mapStateToProps = ({ subscription: { premiumRequiredModalState } }) => ({
  premiumRequiredModalState
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(subscriptionInfo);
