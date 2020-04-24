import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Grid, Card } from '@material-ui/core';

import messages from './Analytics.messages';
import FullScreenDialog from '../UI/FullScreenDialog';
import ModifiedAreaChart from '../UI/ModifiedAreaChart';
import './Analytics.css';

const propTypes = {
  isLogged: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export class Analytics extends PureComponent {
  handleUserHelpClick = () => {
    window.open('https://www.cboard.io/help', '_blank');
  };

  handleGoBack = () => {
    const { history } = this.props;
    history.replace('/');
  };

  render() {
    return (
      <FullScreenDialog
        className="Analytics"
        open
        title={<FormattedMessage {...messages.analytics} />}
        onClose={this.handleGoBack}
      >
        <Fragment>
          <div className="Analytics">
            <div className="card-title">Last month usage</div>
            <ModifiedAreaChart
              height="280px"
              option={{
                series: [
                  {
                    data: [34, 45, 31, 45, 31, 43, 26, 43, 31, 45, 33, 40],
                    type: 'line'
                  }
                ],
                xAxis: {
                  data: [
                    '1',
                    '3',
                    '6',
                    '9',
                    '11',
                    '13',
                    '15',
                    '17',
                    '19',
                    '21',
                    '23',
                    '25'
                  ]
                }
              }}
            />
          </div>
          <div className="analytics m-sm-30 mt--18">
            <Grid container spacing={3}>
              <Grid item lg={8} md={8} sm={12} xs={12} />

              <Grid item lg={4} md={4} sm={12} xs={12}>
                <Card className="px-6 py-4 mb-6">
                  <div className="card-title">Symbol Sources</div>
                </Card>
              </Grid>
            </Grid>
          </div>
        </Fragment>
      </FullScreenDialog>
    );
  }
}

Analytics.propTypes = propTypes;

export default Analytics;
