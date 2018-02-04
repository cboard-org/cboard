import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Settings from './Settings.component';

export class SettingsContainer extends Component {
  static propTypes = {
    lang: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string
  };

  state = {
    aboutOpen: false
  };

  handleGoBackClick = () => {
    this.setState({
      aboutOpen: false
    });
  };

  handleAboutClick = () => {
    this.setState({ aboutOpen: true });
  };

  handleFeedbackClick = () => {
    window.location.href = 'mailto:shayc@outlook.com?subject=Cboard feedback';
  };

  render() {
    const { history, lang } = this.props;

    return (
      <Settings
        lang={lang}
        aboutOpen={this.state.aboutOpen}
        onAboutClick={this.handleAboutClick}
        onGoBackClick={this.handleGoBackClick}
        onFeedbackClick={this.handleFeedbackClick}
        onRequestClose={history.goBack}
      />
    );
  }
}

const mapStateToProps = state => ({
  lang: state.language.lang
});

export default connect(mapStateToProps)(SettingsContainer);
