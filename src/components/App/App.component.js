import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import registerServiceWorker from '../../registerServiceWorker';
import BoardWrapper from '../Board';
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

  componentDidMount() {
    const { onNewContentAvailable, onContentCached } = this.props;
    registerServiceWorker(onNewContentAvailable, onContentCached);
  }

  render() {
    const { lang, dir } = this.props;

    return (
      <div className="App">
        <Helmet>
          <html lang={lang} dir={dir} />
        </Helmet>
        <BoardWrapper />
        <Notifications />
      </div>
    );
  }
}

export default App;
