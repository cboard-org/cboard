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
      usage: {
        max: 100,
        min: 0,
        data: Array.from(Array(30), () => 1)
      },
      totals: { words: 0, phrases: 0, boards: 0, editions: 0 },
      categoryTotals: { navigation: 0, speech: 0, edit: 0 },
      topUsed: { symbols: [], boards: [] }
    };
  }

  clientId = '';
  timerId = '';

  async componentDidMount() {
    this.clientId = await this.getGaClientId();
    console.log(this.clientId);
    const totals = await this.getTotals(this.state.days);
    const usage = await this.getUsage(this.state.days);
    const categoryTotals = await this.getCategoryTotals(this.state.days);
    const topUsed = await this.getTopUsed(this.state.days);
    this.setState({ totals, categoryTotals, usage, topUsed });
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

  getGaClientId = async () => {
    return new Promise((resolve, reject) => {
      if (
        typeof window.ga !== 'undefined' &&
        typeof window.ga.getAll === 'function' &&
        typeof window.ga.getAll()[0] !== 'undefined' &&
        typeof window.ga.getAll()[0].get('clientId') !== 'undefined'
      ) {
        if (this.timerId) {
          console.log('clear');
          clearInterval(this.timerId);
        }
        resolve(window.ga.getAll()[0].get('clientId'));
      } else {
        console.log('entro');
        if (!this.timerId) {
          this.timerId = setInterval(this.getGaClientId, 500);
          console.log(this.timerId);
        }
      }
    });
  };

  async getUsage(days) {
    const request = {
      clientId: this.clientId,
      startDate: `${days}daysago`,
      endDate: 'today',
      metric: 'avgSessionDuration',
      dimension: 'nthDay'
    };
    const report = await API.analyticsReport([request]);
    const data = report.reports[0].data.rows.map(row => {
      return {
        index: parseInt(row.dimensions[1]),
        value: parseInt(row.metrics[0].values[0]) / 60
      };
    });
    let template = Array.from(Array(days), () => 10);
    data.forEach(value => {
      template[value.index] = value.value;
    });
    const usage = {
      max: Math.ceil(
        parseInt(report.reports[0].data.maximums[0].values[0]) / 60
      ),
      min: Math.ceil(
        parseInt(report.reports[0].data.minimums[0].values[0]) / 60
      ),
      data: template
    };
    return usage;
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
      boards: 1 + parseInt(report.reports[2].data['totals'][0]['values'][0]),
      editions: report.reports[3].data['totals'][0]['values'][0]
    };
    return totals;
  }

  async getCategoryTotals(days) {
    const baseData = {
      clientId: this.clientId,
      startDate: `${days}daysago`,
      endDate: 'today',
      metric: 'totalEvents',
      dimension: 'eventCategory',
      filter: ''
    };
    const fullRequest = [];
    fullRequest.push({
      ...baseData,
      filter: { name: 'eventCategory', value: 'Navigation' }
    });
    fullRequest.push({
      ...baseData,
      filter: { name: 'eventCategory', value: 'Speech' }
    });
    fullRequest.push({
      ...baseData,
      filter: { name: 'eventCategory', value: 'Editing' }
    });

    const report = await API.analyticsReport(fullRequest);
    const totals = {
      navigation: report.reports[0].data['totals'][0]['values'][0],
      speech: report.reports[1].data['totals'][0]['values'][0],
      edit: report.reports[2].data['totals'][0]['values'][0]
    };
    return totals;
  }

  async getTopUsed(days) {
    const baseData = {
      clientId: this.clientId,
      startDate: `${days}daysago`,
      endDate: 'today',
      metric: 'totalEvents',
      dimension: 'eventLabel',
      pageSize: 10,
      filter: ''
    };
    const fullRequest = [];
    fullRequest.push({
      ...baseData,
      filter: { name: 'eventAction', value: 'Click Symbol' }
    });
    fullRequest.push({
      ...baseData,
      filter: { name: 'eventAction', value: 'Change Board' }
    });
    const report = await API.analyticsReport(fullRequest);

    const symbolsData = report.reports[0].data['rows'].map(row => {
      const tile = this.getTileFromLabel(row['dimensions'][1]);
      return {
        imgUrl: tile ? tile.image : '/symbols/mulberry/no.svg',
        name: row['dimensions'][1],
        total: row['metrics'][0]['values'][0]
      };
    });
    const boardsData = report.reports[1].data['rows'].map(row => {
      return {
        name: row['dimensions'][1],
        total: row['metrics'][0]['values'][0]
      };
    });

    return {
      symbols: symbolsData,
      boards: boardsData
    };
  }

  getTileFromLabel(label) {
    const { boards } = this.props;
    for (let i = 0; i < boards.length; i++) {
      for (let j = 0; j < boards[i].tiles.length; j++) {
        const tile = boards[i].tiles[j];
        if (
          (tile.label &&
            tile.label.trim().toLowerCase() === label.trim().toLowerCase()) ||
          (tile.labelKey &&
            tile.labelKey
              .split()
              [tile.labelKey.split().length - 1].trim()
              .toLowerCase() ===
              label
                .trim()
                .replace(' ', '')
                .toLowerCase())
        ) {
          return tile;
        }
      }
    }
    return undefined;
  }

  onDaysChange = async days => {
    const totals = await this.getTotals(days);
    const usage = await this.getUsage(days);
    const categoryTotals = await this.getCategoryTotals(days);
    const topUsed = await this.getTopUsed(days);
    this.setState({ days, totals, categoryTotals, usage, topUsed });
  };

  render() {
    return (
      <AnalyticsComponent
        onDaysChange={this.onDaysChange}
        symbolSources={this.getSymbolSources()}
        days={this.state.days}
        totals={this.state.totals}
        categoryTotals={this.state.categoryTotals}
        usage={this.state.usage}
        topUsed={this.state.topUsed}
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
