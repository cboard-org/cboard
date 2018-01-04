import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { injectIntl, intlShape } from 'react-intl';

import registerServiceWorker from '../../registerServiceWorker';
import { showNotification } from '../Notifications/Notifications.actions';
import BoardContainer from '../Board';
import Notifications from '../Notifications';
import messages from './App.messages';
import './App.css';

export class App extends Component {
  static propTypes = {
    /**
     * @ignore
     */
    intl: intlShape.isRequired,
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
    const { intl, showNotification } = this.props;

    const onNewContentAvailable = () => {
      showNotification(intl.formatMessage(messages.newContentAvailable));
    };

    const onContentCached = () => {
      showNotification(intl.formatMessage(messages.contentIsCached));
    };

    registerServiceWorker(onNewContentAvailable, onContentCached);
  }

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

const mapDispatchToProps = {
  showNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(App));
