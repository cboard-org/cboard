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
    window.CdvPurchase.store.validator = async function(receipt, callback) {
      try {
        const transaction = receipt.transactions[0];
        console.log('receipt', receipt);
        const res = await API.postTransaction(transaction);
        console.log('res is: ', res);
        if (!res.ok) throw res;
        console.log('llego a ejecutar el callback');
        callback({
          ok: true,
          data: res.data
        });
      } catch (e) {
        if (!e.ok && e.data) {
          callback({
            ok: false,
            code: e.data?.code, // **Validation error code
            message: e.error.message
          });
          console.error(e);
          return;
        }
        callback({
          ok: false,
          message: 'Impossible to proceed with validation, ' + e
        });
        console.error(e);
      }
    };
    window.CdvPurchase.store.validator_privacy_policy = [
      'analytics',
      'support',
      'tracking',
      'fraud'
    ];

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
      .approved(receipt => {
        console.log('Porverificar', receipt);
        // if (transaction?.transactions?.lenght)
        window.CdvPurchase.store.verify(receipt);
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
