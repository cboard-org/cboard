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
      totalWords: {},
      totalPhrases: {}
    };
  }

  clientId = '';

  async componentDidMount() {
    this.clientId = await this.getGaClientId();
    console.log(this.clientId);
    const totalWords = await this.getTotalWords(this.state.days);
    this.setState({ totalWords });
    const totalPhrases = await this.getTotalPhrases(this.state.days);
    this.setState({ totalPhrases });
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

  async getTotalWords(days) {
    const reportData = {
      clientId: this.clientId,
      startDate: `${days}daysago`,
      endDate: 'today',
      metric: 'totalEvents',
      dimension: 'eventAction',
      filter: { name: 'eventAction', value: 'Click Symbol' }
    };
    const report = await API.analyticsReport(reportData);
    return report.reports[0];
  }

  async getTotalPhrases(days) {
    const reportData = {
      clientId: this.clientId,
      startDate: `${days}daysago`,
      endDate: 'today',
      metric: 'totalEvents',
      dimension: 'eventAction',
      filter: { name: 'eventAction', value: 'Start Speech' }
    };
    const report = await API.analyticsReport(reportData);
    return report.reports[0];
  }

  onDaysChange = async days => {
    this.setState({ days: days });
    const totalWords = await this.getTotalWords(days);
    this.setState({ totalWords });
    const totalPhrases = await this.getTotalPhrases(days);
    this.setState({ totalPhrases });
  };

  render() {
    return (
      <AnalyticsComponent
        onDaysChange={this.onDaysChange}
        symbolSources={this.getSymbolSources()}
        days={this.state.days}
        totalWords={this.state.totalWords}
        totalPhrases={this.state.totalPhrases}
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
