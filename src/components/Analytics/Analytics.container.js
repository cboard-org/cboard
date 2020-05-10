import React, { Component } from 'react';
import { connect } from 'react-redux';
import AnalyticsComponent from './Analytics.component';

import { logout } from '../Account/Login/Login.actions';
import { getUser, isLogged } from '../App/App.selectors';
import API from '../../api';

export class AnalyticsContainer extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    this.state = {
      days: 30,
      isFetching: false,
      totals: { words: 0, phrases: 0, boards: 0, editions: 0 }
    };
  }

  clientId = '';

  async componentDidMount() {
    this.clientId = await this.getGaClientId();
    console.log(this.clientId);
    const totals = await this.getTotals(this.state.days);
    this.setState({ totals });
  }

  getSymbolSources() {
    const { boards } = this.props;
    const images = boards
      .map(board => {
        return board.tiles.map(tile => tile.image);
      })
      .reduce(
        (accumulator, currentValue) => accumulator.concat(currentValue),
        []
      );
    const sources = ['arasaac', 'mulberry', 'cboard', 'globalsymbols'];
    const summary = images.reduce(function(all, image) {
      sources.forEach(source => {
        if (image.match(source)) {
          if (source in all) {
            all[source]++;
          } else {
            all[source] = 1;
          }
        }
      });
      return all;
    }, {});
    let total = 0;
    Object.entries(summary).forEach(([key, value]) => {
      total = total + value;
    });
    let summaryData = [];
    Object.entries(summary).forEach(([key, value]) => {
      summaryData.push({ value: Math.round((value / total) * 100), name: key });
    });
    return summaryData;
  }

  async getGaClientId(limit = 0) {
    if (limit > 7) {
      return undefined;
    }
    if (
      typeof window.ga !== 'undefined' &&
      typeof window.ga.getAll === 'function'
    ) {
      return window.ga.getAll()[0].get('clientId');
    } else {
      setTimeout(this.getGaClientId(limit + 1), 500);
    }
  }

  async getTotals(days) {
    const baseData = {
      clientId: this.clientId,
      startDate: `${days}daysago`,
      endDate: 'today',
      metric: 'totalEvents',
      dimension: 'eventAction',
      filter: ''
    };
    const fullRequest = [];
    fullRequest.push({
      ...baseData,
      filter: { name: 'eventAction', value: 'Click Symbol' }
    });
    fullRequest.push({
      ...baseData,
      filter: { name: 'eventAction', value: 'Start Speech' }
    });
    fullRequest.push({
      ...baseData,
      filter: { name: 'eventAction', value: 'Create Tile' }
    });
    fullRequest.push({
      ...baseData,
      filter: { name: 'eventAction', value: 'Change Board' }
    });
    const report = await API.analyticsReport(fullRequest);
    const totals = {
      words: report.reports[0].data['totals'][0]['values'][0],
      phrases: report.reports[1].data['totals'][0]['values'][0],
      boards: report.reports[2].data['totals'][0]['values'][0],
      editions: report.reports[3].data['totals'][0]['values'][0]
    };
    return totals;
  }

  onDaysChange = async days => {
    this.setState({ days: days });
    const totals = await this.getTotals(this.state.days);
    this.setState({ totals });
  };

  render() {
    return (
      <AnalyticsComponent
        onDaysChange={this.onDaysChange}
        symbolSources={this.getSymbolSources()}
        days={this.state.days}
        totals={this.state.totals}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => ({
  isLogged: isLogged(state),
  user: getUser(state),
  boards: state.board.boards
});

const mapDispatchToProps = {
  logout
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnalyticsContainer);
