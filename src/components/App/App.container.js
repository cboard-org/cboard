import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import registerServiceWorker from '../../registerServiceWorker';
import { showNotification } from '../Notifications/Notifications.actions';
import { isFirstVisit, isLogged } from './App.selectors';
import messages from './App.messages';
import App from './App.component';
import { DISPLAY_SIZE_STANDARD } from '../Settings/Display/Display.constants';
import { hasPendingSyncBoards } from '../Board/Board.selectors';

import {
  updateUserDataFromAPI,
  updateLoggedUserLocation,
  updateUnloggedUserLocation,
  updateConnectivity
} from '../App/App.actions';
import { getApiObjects } from '../Board/Board.actions';
import {
  isCordova,
  isElectron,
  onCvaResume,
  cleanUpCvaOnResume
} from '../../cordova-util';

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
    lang: PropTypes.string.isRequired,
    displaySettings: PropTypes.object.isRequired,
    /**
     * User Id
     */
    userId: PropTypes.string,
    /**
     * Get API objects (boards and communicators)
     */
    getApiObjects: PropTypes.func.isRequired
  };

  lastSyncTime = null;

  componentDidMount() {
    const localizeUser = () => {
      const {
        isLogged,
        updateUserDataFromAPI,
        updateLoggedUserLocation,
        updateUnloggedUserLocation
      } = this.props;

      if (isLogged) return loggedActions();
      return updateUnloggedUserLocation();

      async function loggedActions() {
        await updateUserDataFromAPI();
        updateLoggedUserLocation();
      }
    };

    const initGoogleAnalytics = () => {
      const { isLogged, userId } = this.props;
      if (isCordova() && !isElectron()) {
        try {
          if (isLogged) {
            window.FirebasePlugin.setUserId(userId);
          }
          window.FirebasePlugin.logEvent('page_view');
        } catch (err) {
          console.error(err);
        }
        return;
      }

      if (!isCordova() && typeof window?.gtag === 'function') {
        window.gtag('set', { user_id: userId });
      }
    };

    registerServiceWorker(
      this.handleNewContentAvailable,
      this.handleContentCached
    );

    localizeUser();

    initGoogleAnalytics();

    // Set initial connection status and register event listeners
    if (!navigator.onLine) {
      this.handleOffline();
    } else {
      this.props.updateConnectivity({ isConnected: true });
    }
    window.addEventListener('offline', this.handleOffline);
    window.addEventListener('online', this.handleOnline);

    onCvaResume(this.handleCvaResume);
    document.addEventListener(
      'visibilitychange',
      this.handleWebVisibilityChange
    );

    this.handleDataRefresh('App started');
  }

  componentWillUnmount() {
    cleanUpCvaOnResume(this.handleCvaResume);
    document.removeEventListener(
      'visibilitychange',
      this.handleWebVisibilityChange
    );
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  isSyncRecentlyExecuted = () => {
    const THROTTLE_MS = 1000 * 60 * 2;
    return this.lastSyncTime && Date.now() - this.lastSyncTime < THROTTLE_MS;
  };

  handleDataRefresh = (source = 'Unknown') => {
    const { isLogged, hasPendingSyncBoards } = this.props;

    if (!isLogged) {
      return;
    }

    if (!window.navigator.onLine) {
      console.log('Sync skipped - Device is offline');
      return;
    }

    if (this.isSyncRecentlyExecuted() && !hasPendingSyncBoards) {
      console.log(`Sync skipped - throttled (${source})`);
      return;
    }

    this.lastSyncTime = Date.now();
    console.log(`Sync dispatched - ${source}`);
    this.props.getApiObjects();
  };

  handleOffline = () => {
    if (navigator.onLine) {
      return;
    }
    this.props.updateConnectivity({ isConnected: false });
  };

  handleOnline = () => {
    if (!navigator.onLine) {
      return;
    }
    this.props.updateConnectivity({ isConnected: true });
    this.handleDataRefresh('Connection restored');
  };

  handleWebVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      this.handleDataRefresh('Tab focused');
    }
  };

  handleCvaResume = () => this.handleDataRefresh('App resumed');

  handleNewContentAvailable = () => {
    const { intl, showNotification } = this.props;
    showNotification(
      intl.formatMessage(messages.newContentAvailable),
      'refresh'
    ); //send the kind of notification.
  };

  handleContentCached = () => {
    const { intl, showNotification } = this.props;
    showNotification(intl.formatMessage(messages.contentIsCached));
  };

  render() {
    const {
      dir,
      isFirstVisit,
      isLogged,
      lang,
      displaySettings,
      isDownloadingLang
    } = this.props;

    const uiSize = displaySettings.uiSize || DISPLAY_SIZE_STANDARD;
    const fontSize = displaySettings.fontSize || DISPLAY_SIZE_STANDARD;
    const classes = [
      'Cboard__DisplaySettings',
      `Cboard__UISize__${uiSize}`,
      `Cboard__FontSize__${fontSize}`
    ];

    const htmlElement = document.getElementsByTagName('html')[0];
    htmlElement.className = classes.join(' ');

    return (
      <App
        dir={dir}
        isFirstVisit={isFirstVisit}
        isLogged={isLogged}
        lang={lang}
        dark={displaySettings.darkThemeActive}
        isDownloadingLang={isDownloadingLang}
      />
    );
  }
}

const mapStateToProps = state => ({
  dir: state.language.dir,
  isFirstVisit: isFirstVisit(state),
  isLogged: isLogged(state),
  lang: state.language.lang,
  displaySettings: state.app.displaySettings,
  isDownloadingLang: state.language.downloadingLang.isdownloading,
  userId: state.app.userData.id,
  hasPendingSyncBoards: hasPendingSyncBoards(state)
});

const mapDispatchToProps = {
  showNotification,
  updateUserDataFromAPI,
  updateLoggedUserLocation,
  updateUnloggedUserLocation,
  updateConnectivity,
  getApiObjects
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(AppContainer));
