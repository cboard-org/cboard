import React from 'react';
import { connect } from 'react-redux';
import { enableAllTours } from '../../App/App.actions';
import ResetToursItem from './ResetToursItem.component';

const ResetToursItemContainer = props => <ResetToursItem {...props} />;
const mapStateToProps = () => ({});

const mapDispatchToProps = {
  enableAllTours
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetToursItemContainer);
