import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import BoardContainer from '../Board';
import Notifications from '../Notifications';
import './App.css';

export class App extends Component {
  static propTypes = {
    /**
     * App language
     */
    lang: PropTypes.string.isRequired,
    /**
     * App direction
     */
    dir: PropTypes.string.isRequired
  };

  render() {
    const { lang, dir } = this.props;

    return (
      <div className="App" onClick={() => {}}>
        <Helmet>
          <html lang={lang} dir={dir} />
        </Helmet>
        <BoardContainer />
        <Notifications />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.language.lang,
  dir: state.language.dir
});

export default connect(mapStateToProps)(App);
