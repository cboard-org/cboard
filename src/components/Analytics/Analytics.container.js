import React, { Component } from 'react';
import { connect } from 'react-redux';
import AnalyticsComponent from './Analytics.component';

import { logout } from '../Account/Login/Login.actions';
import { getUser, isLogged } from '../App/App.selectors';
import API from '../../api';

export class AnalyticsContainer extends Component {
  static propTypes = {};

  state = {
    isFetching: false,
    totalWords: {}
  };

  async componentDidMount() {
    const totalWords = await this.getTotalWords();
    this.setState({ totalWords });
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

  async getGaClientId() {
    if (
      typeof window.ga !== 'undefined' &&
      typeof window.ga.getAll === 'function'
    ) {
      return window.ga.getAll()[0].get('clientId');
    } else {
      setTimeout(this.getGaClientId(), 500);
    }
  }

  async getTotalWords() {
    const clientId = await this.getGaClientId();
    console.log(clientId);
    const reportData = {
      clientId: '1635071876.1577121026',
      startDate: '77daysago',
      endDate: 'today',
      metric: 'totalEvents',
      dimension: 'eventLabel'
    };
    const report = await API.analyticsReport(reportData);
    return report.reports[0];
  }

  getTotalWordsTotal() {
    let total = 0;
    if (typeof this.state.totalWords.data !== 'undefined') {
      return this.state.totalWords.data['totals'][0]['values'][0];
    }
    return 0;
  }

  render() {
    return (
      <AnalyticsComponent
        symbolSources={this.getSymbolSources()}
        totalWords={this.getTotalWordsTotal()}
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
