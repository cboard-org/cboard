import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { isArray } from 'lodash';

import AnalyticsComponent from './Analytics.component';
import { logout } from '../Account/Login/Login.actions';
import { getUser, isLogged } from '../App/App.selectors';
import { showNotification } from '../Notifications/Notifications.actions';
import API from '../../api';
import messages from './Analytics.messages';
import { isCordova } from '../../cordova-util';

export class AnalyticsContainer extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    isLogged: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    boards: PropTypes.array.isRequired,
    logout: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      days: 30,
      isFetching: false,
      usage: {
        max: 100,
        min: 0,
        data: Array.from(Array(30), () => 0)
      },
      totals: {
        words: {
          title: props.intl.formatMessage(messages.totalWords)
        },
        phrases: {
          title: props.intl.formatMessage(messages.totalPhrases)
        },
        boards: {
          title: props.intl.formatMessage(messages.boardsUsed)
        },
        editions: {
          title: props.intl.formatMessage(messages.tilesEdited)
        }
      },
      categoryTotals: {
        navigation: {
          value: 0,
          title: props.intl.formatMessage(messages.navigationEvents)
        },
        speech: {
          value: 0,
          title: props.intl.formatMessage(messages.speechEvents)
        },
        edit: {
          value: 0,
          title: props.intl.formatMessage(messages.editingEvents)
        }
      },
      topUsed: { symbols: [], boards: [] }
    };
  }

  clientId = '';
  timerId = '';

  async componentDidMount() {
    const { intl, showNotification } = this.props;
    this.setState({ isFetching: true });
    try {
      this.clientId = await this.getGaClientId();
      const totals = await this.getTotals(this.state.days);
      const usage = await this.getUsage(this.state.days);
      const categoryTotals = await this.getCategoryTotals(this.state.days);
      const topUsed = this.getTopUsed(totals);
      this.setState({
        totals,
        categoryTotals,
        usage,
        topUsed,
        isFetching: false
      });
    } catch (err) {
      this.setState({ isFetching: false });
      showNotification(intl.formatMessage(messages.loadingError));
      console.log(err.message);
    }
  }

  getSymbolSources() {
    try {
      const { boards } = this.props;
      const images = boards
        .map(board => {
          return isArray(board.tiles)
            ? board.tiles.map(tile => (tile ? tile.image : 'invalid'))
            : [];
        })
        .reduce(
          (accumulator, currentValue) => accumulator.concat(currentValue),
          []
        );
      const sources = ['arasaac', 'mulberry', 'cboard', 'globalsymbols'];
      const summary = images.reduce(function(all, image) {
        sources.forEach(source => {
          try {
            if (image.match(source)) {
              if (source in all) {
                all[source]++;
              } else {
                all[source] = 1;
              }
            }
          } catch (err) {
            //just skip the image in counting
          }
        });
        return all;
      }, {});
      const summaryData = Object.entries(summary).map(([key, value]) => {
        return {
          value: value,
          name: key
        };
      });
      return summaryData;
    } catch (err) {
      console.log(err.message);
      return [{ value: 0, name: 'No data' }];
    }
  }

  getGaClientIdFromCookie = () => {
    var nameEQ = '_ga=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0)
        return c.substring(nameEQ.length + 6, c.length);
    }
    return null;
  };

  getGaClientId = async () => {
    return new Promise((resolve, reject) => {
      this.timerId = setTimeout(() => {
        if (isCordova()) {
          resolve(this.getGaClientIdFromCookie());
        } else if (
          typeof window.ga !== 'undefined' &&
          typeof window.ga.getAll === 'function' &&
          typeof window.ga.getAll()[0] !== 'undefined' &&
          typeof window.ga.getAll()[0].get('clientId') !== 'undefined'
        ) {
          resolve(window.ga.getAll()[0].get('clientId'));
        } else {
          reject(
            new Error({ message: 'Google analytics client id not found' })
          );
        }
      }, 800);
    });
  };

  async getUsage(days) {
    const request = {
      mobileView: isCordova(),
      clientId: this.clientId,
      startDate: `${days}daysago`,
      endDate: 'today',
      metric: 'avgSessionDuration',
      dimension: 'nthDay'
    };
    let template = Array.from(Array(days), () => 0);
    let usage = {
      max: 10,
      min: 0,
      data: template
    };
    try {
      const report = await API.analyticsReport([request]);
      if (
        report &&
        report.reports &&
        report.reports.length >= 1 &&
        report.reports[0].data['rows']
      ) {
        const data = report.reports[0].data.rows.map(row => {
          return {
            index: parseInt(row.dimensions[1]),
            value: parseInt(row.metrics[0].values[0]) / 60
          };
        });
        data.forEach(value => {
          template[value.index] = value.value;
        });
        usage = {
          max: Math.ceil(
            parseInt(report.reports[0].data.maximums[0].values[0]) / 60
          ),
          min: 0,
          data: template
        };
      }
    } catch (err) {}
    return usage;
  }

  async getTotals(days) {
    const baseData = {
      mobileView: isCordova(),
      clientId: this.clientId,
      startDate: `${days}daysago`,
      endDate: 'today',
      metric: 'totalEvents',
      dimension: 'eventLabel',
      filter: ''
    };
    const fullRequest = [];
    fullRequest.push({
      ...baseData,
      filter: { name: 'eventAction', value: 'Click Symbol' }
    });
    fullRequest.push({
      ...baseData,
      filter: { name: 'eventAction', value: 'Click Output' }
    });
    fullRequest.push({
      ...baseData,
      filter: { name: 'eventAction', value: 'Create Tile' }
    });
    fullRequest.push({
      ...baseData,
      filter: { name: 'eventAction', value: 'Edit Tiles' }
    });
    fullRequest.push({
      ...baseData,
      filter: { name: 'eventAction', value: 'Change Board' }
    });
    const report = await API.analyticsReport(fullRequest);

    const totals = {
      words: {
        ...this.state.totals.words,
        total: this.getReportTotal(report, 0),
        rows: this.getReportRows(report, 0, 'sound')
      },
      phrases: {
        ...this.state.totals.phrases,
        total: this.getReportTotal(report, 1),
        rows: this.getReportRows(report, 1, 'sound')
      },
      editions: {
        ...this.state.totals.editions,
        total:
          Number(this.getReportTotal(report, 2)) +
          Number(this.getReportTotal(report, 3)),
        rows: this.getReportRows(report, 2).concat(
          this.getReportRows(report, 3)
        )
      },
      boards: {
        ...this.state.totals.boards,
        total: this.getReportTotal(report, 4, 'rowCount'),
        rows: this.getReportRows(report, 4)
      }
    };
    return totals;
  }

  getReportTotal(report, index = 0, type = 'totals') {
    let total = 0;
    if (
      report &&
      report.reports &&
      report.reports.length >= index &&
      report.reports[index].data['rows']
    ) {
      if (type === 'rowCount') {
        total = report.reports[index].data['rowCount'];
      } else {
        total = report.reports[index].data['totals'][0]['values'][0];
      }
    }
    return total;
  }

  getReportRows(report, index = 0, type = 'view', max = 10) {
    let rows = [];
    if (
      report &&
      report.reports &&
      report.reports.length >= index &&
      report.reports[index].data['rows']
    ) {
      rows = report.reports[index].data['rows'].slice(0, max).map(row => {
        return {
          name: row['dimensions'][1],
          total: row['metrics'][0]['values'][0],
          type: type
        };
      });
    }
    return rows;
  }

  async getCategoryTotals(days) {
    const baseData = {
      mobileView: isCordova(),
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
      navigation: {
        ...this.state.categoryTotals.navigation,
        value: this.getReportTotal(report, 0)
      },
      speech: {
        ...this.state.categoryTotals.speech,
        value: this.getReportTotal(report, 1)
      },
      edit: {
        ...this.state.categoryTotals.edit,
        value: this.getReportTotal(report, 2)
      }
    };
    return totals;
  }

  getTopUsed(totals) {
    return {
      symbols: totals['words']['rows'] || [],
      boards: totals['boards']['rows'] || []
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
    const { intl, showNotification } = this.props;
    this.setState({ isFetching: true });
    try {
      const totals = await this.getTotals(days);
      const usage = await this.getUsage(days);
      const categoryTotals = await this.getCategoryTotals(days);
      const topUsed = this.getTopUsed(totals);
      this.setState({
        days,
        totals,
        categoryTotals,
        usage,
        topUsed,
        isFetching: false
      });
    } catch (err) {
      this.setState({ isFetching: false });
      showNotification(intl.formatMessage(messages.loadingError));
      console.log(err.message);
    }
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
        isFetching={this.state.isFetching}
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
  logout,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(AnalyticsContainer));
