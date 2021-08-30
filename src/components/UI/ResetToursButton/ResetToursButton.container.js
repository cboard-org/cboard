import React from 'react';
import { connect } from 'react-redux';
import { enableAllTours } from '../../App/App.actions';
import ResetToursButton from './ResetToursButton.component';

const ResetToursButtonContainer = props => <ResetToursButton {...props} />;
const mapStateToProps = () => ({});

const mapDispatchToProps = {
  enableAllTours
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetToursButtonContainer);
