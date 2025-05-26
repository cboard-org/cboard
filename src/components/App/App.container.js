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
import { isCordova, isElectron } from '../../cordova-util';
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
    userId: PropTypes.string
  };

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

    const initCVAGa4 = () => {
      const { isLogged, userId } = this.props;
      if (!isElectron()) {
        try {
          if (isLogged) {
            window.FirebasePlugin.setUserId(userId);
          }
          window.FirebasePlugin.logEvent('page_view');
        } catch (err) {
          console.error(err);
        }
      }
    };

    registerServiceWorker(
      this.handleNewContentAvailable,
      this.handleContentCached
    );

    localizeUser();

    if (isCordova()) initCVAGa4();

    const configureConnectionStatus = () => {
      const { updateConnectivity } = this.props;
      const setAsOnline = () => {
        updateConnectivity({ isConnected: true });
      };

      const setAsOffline = () => {
        updateConnectivity({ isConnected: false });
      };

      const addConnectionEventListeners = () => {
        window.addEventListener('offline', setAsOffline);
        window.addEventListener('online', setAsOnline);
      };

      const setCurrentConnectionStatus = () => {
        if (!navigator.onLine) {
          setAsOffline();
          return;
        }
        setAsOnline();
        return;
      };

      setCurrentConnectionStatus();
      addConnectionEventListeners();
    };

    configureConnectionStatus();
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
  updateConnectivity
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(AppContainer));
