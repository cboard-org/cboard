import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { updateNavigationSettings } from '../../App/App.actions';
import Navigation from './Navigation.component';

export class NavigationContainer extends PureComponent {
  static propTypes = {
    intl: intlShape.isRequired
  };

  render() {
    const { history } = this.props;

    return <Navigation onClose={history.goBack} {...this.props} />;
  }
}

NavigationContainer.props = {
  history: PropTypes.object,
  updateNavigationSettings: PropTypes.func.isRequired,
  navigationSettings: PropTypes.object.isRequired
};

const mapStateToProps = ({ app: { navigationSettings } }) => ({
  navigationSettings
});
const mapDispatchToProps = { updateNavigationSettings };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(NavigationContainer));
