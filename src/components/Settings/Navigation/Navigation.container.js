import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { updateNavigationSettings } from '../../App/App.actions';
import Navigation from './Navigation.component';
import API from '../../../api';
import { changeLiveMode } from '../../Board/Board.actions';

export class NavigationContainer extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired,
    isLiveMode: PropTypes.bool,
    changeLiveMode: PropTypes.func
  };

  updateNavigationSettings = async navigationSettings => {
    try {
      await API.updateSettings({ navigation: navigationSettings });
    } catch (e) {}
    this.props.updateNavigationSettingsAction(navigationSettings);
  };

  render() {
    const { history, isLiveMode, changeLiveMode } = this.props;

    return (
      <Navigation
        {...this.props}
        onClose={history.goBack}
        isLiveMode={isLiveMode}
        changeLiveMode={changeLiveMode}
        updateNavigationSettings={this.updateNavigationSettings}
      />
    );
  }
}

NavigationContainer.props = {
  history: PropTypes.object,
  updateNavigationSettings: PropTypes.func.isRequired,
  navigationSettings: PropTypes.object.isRequired
};

const mapStateToProps = ({ board, app }) => {
  return {
    isLiveMode: board.isLiveMode,
    navigationSettings: app.navigationSettings
  };
};

const mapDispatchToProps = {
  updateNavigationSettingsAction: updateNavigationSettings,
  changeLiveMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(NavigationContainer));
