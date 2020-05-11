import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Grid, Card } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import messages from './Analytics.messages';
import FullScreenDialog from '../UI/FullScreenDialog';
import ModifiedAreaChart from '../UI/ModifiedAreaChart';
import StatCards from '../UI/StatCards';
import StatCards2 from '../UI/StatCards2';
import TableCard from '../UI/TableCard';
import DoughnutChart from '../UI/Doughnut';
import './Analytics.css';

const propTypes = {
  /**
   * Callback fired when selected a new days range
   */
  onDaysChange: PropTypes.func.isRequired,
  days: PropTypes.number.isRequired,
  isLogged: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  symbolSources: PropTypes.array.isRequired,
  totals: PropTypes.object.isRequired,
  usage: PropTypes.object.isRequired
};

export class Analytics extends PureComponent {
  handleUserHelpClick = () => {
    window.open('https://www.cboard.io/help', '_blank');
  };

  handleGoBack = () => {
    const { history } = this.props;
    history.replace('/');
  };

  handleDaysChange = event => {
    this.props.onDaysChange(event.target.value);
  };

  getDates = range => {
    const days = [];
    const dateEnd = moment();
    const dateStart = moment().add(-range, 'days');
    while (dateEnd.diff(dateStart, 'days') >= 0) {
      days.push(dateStart.format('DD/MM'));
      dateStart.add(1, 'days');
    }
    return days;
  };

  render() {
    const { theme, symbolSources } = this.props;
    return (
      <FullScreenDialog
        className="Analytics"
        open
        title={<FormattedMessage {...messages.analytics} />}
        onClose={this.handleGoBack}
      >
        <Fragment>
          <div className="Analytics__Graph">
            <FormControl variant="outlined">
              <Select
                labelId="range-select-label"
                id="range-select"
                autoWidth={false}
                onChange={this.handleDaysChange}
                value={this.props.days}
              >
                <MenuItem value={10}>Ten days usage</MenuItem>
                <MenuItem value={20}>Twenty days usage</MenuItem>
                <MenuItem value={30}>Thirty days usage</MenuItem>
                <MenuItem value={60}>Sixty days usage</MenuItem>
              </Select>
            </FormControl>
            <ModifiedAreaChart
              height="200px"
              option={{
                series: [
                  {
                    data: this.props.usage.data,
                    type: 'line'
                  }
                ],
                xAxis: {
                  data: this.getDates(this.props.days)
                },
                yAxis: {
                  max: this.props.usage.max,
                  min: this.props.usage.min,
                  offset: -13
                }
              }}
            />
          </div>
          <div className="Analytics__Metrics">
            <Grid container spacing={3}>
              <Grid item lg={8} md={8} sm={12} xs={12}>
                <StatCards totals={this.props.totals} />
                <TableCard />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <Card className="Analytics__Card">
                  <div className="Analytics__Card__Title">Symbol Sources</div>
                  <DoughnutChart
                    data={symbolSources}
                    height="300px"
                    color={[
                      theme.palette.primary.dark,
                      theme.palette.primary.main,
                      theme.palette.primary.light
                    ]}
                  />
                </Card>
                <StatCards2 />
              </Grid>
            </Grid>
          </div>
        </Fragment>
      </FullScreenDialog>
    );
  }
}

Analytics.propTypes = propTypes;

export default withStyles({}, { withTheme: true })(Analytics);
