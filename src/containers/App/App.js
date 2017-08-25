import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { initApp } from './actions';
import Board from '../Board';
import Notifications from '../Notifications';
import './App.css';

export class App extends Component {
  componentDidMount() {
    const { initApp } = this.props;
    initApp();
  }

  render() {
    const { locale, dir } = this.props;

    return (
      <div className="App" onClick={()=>{}}>
        <Helmet>
          <html lang={locale} dir={dir} />
        </Helmet>
        <Board />
        <Notifications />
      </div>
    );
  }
}

App.propTypes = {
  locale: PropTypes.string,
  dir: PropTypes.string,
};

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
