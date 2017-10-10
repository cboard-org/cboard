import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { initApp } from './App.actions';
import BoardContainer from '../Board';
import Notifications from '../Notifications';
import './App.css';

export class App extends Component {
  static propTypes = {
    locale: PropTypes.string,
    dir: PropTypes.string,
    initApp: PropTypes.func
  };

  componentDidMount() {
    const { initApp } = this.props;
    initApp();
  }

  render() {
    const { locale, dir } = this.props;

    return (
      <div className="App" onClick={() => {}}>
        <Helmet>
          <html lang={locale} dir={dir} />
        </Helmet>
        <BoardContainer />
        <Notifications />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    locale: state.language.locale,
    dir: state.language.dir
  };
};

const mapDispatchToProps = dispatch => {
  return {
    initApp: () => dispatch(initApp())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
