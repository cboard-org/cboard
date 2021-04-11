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
    registerServiceWorker(
      this.handleNewContentAvailable,
      this.handleContentCached
    );
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
    const { dir, isFirstVisit, isLogged, lang, displaySettings } = this.props;

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
      />
    );
  }
}

const mapStateToProps = state => ({
  dir: state.language.dir,
  isFirstVisit: isFirstVisit(state),
  isLogged: isLogged(state),
  lang: state.language.lang,
  displaySettings: state.app.displaySettings
});

const mapDispatchToProps = {
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(AppContainer));
