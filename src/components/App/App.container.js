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

  constructor(props) {
    super(props);
    this.syncDebounceTimer = null;
    this.handleOnline = null;
    this.handleOffline = null;
  }

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

    const configureConnectionStatus = () => {
      const { updateConnectivity } = this.props;

      this.handleOffline = () => {
        if (navigator.onLine) {
          return;
        }
        updateConnectivity({ isConnected: false });
      };

      this.handleOnline = () => {
        if (!navigator.onLine) {
          return;
        }
        updateConnectivity({ isConnected: true });
        this.handleDataRefresh('Connection restored');
      };

      const addConnectionEventListeners = () => {
        window.addEventListener('offline', this.handleOffline);
        window.addEventListener('online', this.handleOnline);
      };

      const setCurrentConnectionStatus = () => {
        if (!navigator.onLine) {
          this.handleOffline();
          return;
        }
        updateConnectivity({ isConnected: true });
      };

      setCurrentConnectionStatus();
      addConnectionEventListeners();
    };

    configureConnectionStatus();

    this.handleDataRefresh = (source = 'Unknown') => {
      const { isLogged } = this.props;

      if (!isLogged) {
        return;
      }

      if (!window.navigator.onLine) {
        console.log('Sync skipped - Device is offline');
        return;
      }

      if (this.syncDebounceTimer) {
        clearTimeout(this.syncDebounceTimer);
      }

      this.syncDebounceTimer = setTimeout(() => {
        console.log(`Sync dispatched - ${source}`);
        // TODO: Replace with actual API call
        // this.props.getApiObjects();
      }, 2000);
    };

    this.handleWebVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        this.handleDataRefresh('Tab focused');
      }
    };

    onCvaResume(() => this.handleDataRefresh('App resumed'));
    document.addEventListener(
      'visibilitychange',
      this.handleWebVisibilityChange
    );
  }

  componentWillUnmount() {
    if (this.syncDebounceTimer) {
      clearTimeout(this.syncDebounceTimer);
    }

    cleanUpCvaOnResume(() => this.handleDataRefresh('App resumed'));
    document.removeEventListener(
      'visibilitychange',
      this.handleWebVisibilityChange
    );

    if (this.handleOnline) {
      window.removeEventListener('online', this.handleOnline);
    }
    if (this.handleOffline) {
      window.removeEventListener('offline', this.handleOffline);
    }
  }

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
  userId: state.app.userData.id
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
