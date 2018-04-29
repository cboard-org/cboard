import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import registerServiceWorker from '../../registerServiceWorker';
import { showNotification } from '../Notifications/Notifications.actions';
import { isFirstVisit, isLogged } from './App.selectors';
import messages from './App.messages';
import App from './App.component';

export class AppContainer extends Component {
  static propTypes = {
    /**
     * App language direction
     */
    dir: PropTypes.string.isRequired,
    /**
     * @ignore
     */
    intl: intlShape.isRequired,
    /**
     * If 'true', user first visit
     */
    isFirstVisit: PropTypes.bool,
    /**
     * If 'true', user is logged in
     */
    isLogged: PropTypes.bool,
    /**
     * App language
     */
    lang: PropTypes.string.isRequired
  };

  componentDidMount() {
    registerServiceWorker(
      this.handleNewContentAvailable,
      this.handleContentCached
    );
  }

  handleNewContentAvailable = () => {
    const { intl } = this.props;
    showNotification(intl.formatMessage(messages.newContentAvailable));
  };

  handleContentCached = () => {
    const { intl } = this.props;
    showNotification(intl.formatMessage(messages.contentIsCached));
  };

  render() {
    const { dir, isFirstVisit, isLogged, lang } = this.props;

    return (
      <App
        dir={dir}
        isFirstVisit={isFirstVisit}
        isLogged={isLogged}
        lang={lang}
      />
    );
  }
}

const mapStateToProps = state => ({
  dir: state.language.dir,
  isFirstVisit: isFirstVisit(state),
  isLogged: isLogged(state),
  lang: state.language.lang
});

const mapDispatchToProps = {
  showNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(AppContainer)
);
