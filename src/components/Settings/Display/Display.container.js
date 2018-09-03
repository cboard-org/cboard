import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { updateDisplaySettings } from '../../App/App.actions';
import Display from './Display.component';

export class DisplayContainer extends PureComponent {
  render() {
    const { history } = this.props;
    return <Display {...this.props} onClose={history.goBack} />;
  }
}

DisplayContainer.props = {
  intl: intlShape.isRequired,
  displaySettings: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  updateDisplaySettings: PropTypes.func
};

const mapStateToProps = ({ app: { displaySettings } }) => ({ displaySettings });

const mapDispatchToProps = {
  updateDisplaySettings
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(DisplayContainer));
