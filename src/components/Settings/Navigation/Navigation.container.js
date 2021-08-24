import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { updateNavigationSettings } from '../../App/App.actions';
import Navigation from './Navigation.component';
import API from '../../../api';
import { enableTour } from '../../App/App.actions';

export class NavigationContainer extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired
  };

  updateNavigationSettings = async navigationSettings => {
    try {
      await API.updateSettings({ navigation: navigationSettings });
    } catch (e) {}
    this.props.updateNavigationSettingsAction(navigationSettings);
  };

  updateAllToursStates = resetTours => {
    if (resetTours) {
      this.props.enableTour();
    }
  };

  render() {
    const { history } = this.props;

    return (
      <Navigation
        {...this.props}
        onClose={history.goBack}
        updateNavigationSettings={this.updateNavigationSettings}
        updateAllToursStates={this.updateAllToursStates}
      />
    );
  }
}

NavigationContainer.props = {
  history: PropTypes.object,
  updateNavigationSettings: PropTypes.func.isRequired,
  navigationSettings: PropTypes.object.isRequired,
  disableTour: PropTypes.func.isRequired
};

const mapStateToProps = ({ app: { navigationSettings } }) => ({
  navigationSettings
});

const mapDispatchToProps = {
  updateNavigationSettingsAction: updateNavigationSettings,
  enableTour
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(NavigationContainer));
