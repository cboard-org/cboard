import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import { showNotification } from '../Notifications/Notifications.actions';
import messages from './App.messages';
import App from './App.component';

export class AppContainer extends Component {
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
     * App language direction
     */
    dir: PropTypes.string.isRequired
  };

  onNewContentAvailable = () => {
    const { intl } = this.props;
    showNotification(intl.formatMessage(messages.newContentAvailable));
  };

  onContentCached = () => {
    const { intl } = this.props;
    showNotification(intl.formatMessage(messages.contentIsCached));
  };

  render() {
    const { lang, dir } = this.props;

    return (
      <App
        lang={lang}
        dir={dir}
        onNewContentAvailable={this.onNewContentAvailable}
        onContentCached={this.onContentCached}
      />
    );
  }
}

const mapStateToProps = state => ({
  dir: state.language.dir,
  lang: state.language.lang
});

const mapDispatchToProps = {
  showNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(AppContainer)
);
