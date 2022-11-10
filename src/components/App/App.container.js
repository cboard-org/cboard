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
  updateLoggedUserLocation,
  updateUnloggedUserLocation
} from '../App/App.actions';
import { isAndroid } from '../../cordova-util';
import API from '../../api';
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
    displaySettings: PropTypes.object.isRequired
  };

  componentDidMount() {
    const localizeUser = () => {
      const {
        isLogged,
        updateLoggedUserLocation,
        updateUnloggedUserLocation
      } = this.props;

      if (isLogged) return updateLoggedUserLocation();
      return updateUnloggedUserLocation();
    };

    registerServiceWorker(
      this.handleNewContentAvailable,
      this.handleContentCached
    );

    localizeUser();

    if (isAndroid()) this.configInAppPurchasePlugin();
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

  configInAppPurchasePlugin = () => {
    window.CdvPurchase.store.validator = async function(product, callback) {
      try {
        const res = await API.postTransaction(product);
        if (!res.ok) throw res;

        callback(true, { res }); // success!
        //callback(true, { transaction: "your custom details" }); // success!
        // your custom details will be merged into the product's transaction field
      } catch (e) {
        if (!e.ok) {
          callback(false, {
            code: e.data.code, // **Validation error code
            error: {
              message: e.error.message
            }
          });
          return;
        }

        callback(false, 'Impossible to proceed with validation');
      }
    };

    // window.store
    //   .when('subscription')
    //   .approved(p => {
    //     console.log('Porverificar', p);
    //     p.verify();
    //   })
    //   .verified(p => {
    //     console.log('Verificado, cambiar estado', p);
    //     p.finish();
    //   })
    //   .owned(p => console.log(`you now own ${p.alias}`));
    window.CdvPurchase.store
      .when()
      .approved(transaction => {
        console.log('Porverificar', transaction);
        //window.CdvPurchase.store.verify(transaction);
      })
      .verified(receipt => {
        console.log('Verificado, cambiar estado', receipt);
        window.CdvPurchase.store.finish(receipt);
      });
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
  isDownloadingLang: state.language.downloadingLang.isdownloading
});

const mapDispatchToProps = {
  showNotification,
  updateLoggedUserLocation,
  updateUnloggedUserLocation
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(AppContainer));
