import React, { Component } from 'react';
import { connect } from 'react-redux';
import AnalyticsComponent from './Analytics.component';

import { logout } from '../Account/Login/Login.actions';
import { getUser, isLogged } from '../App/App.selectors';

export class AnalyticsContainer extends Component {
  static propTypes = {};

  componentDidUpdate(prevProps) {}

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

  render() {
    return (
      <AnalyticsComponent
        symbolSources={this.getSymbolSources()}
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
