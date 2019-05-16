import React from 'react';
import { connect } from 'react-redux';
import InputImage from './InputImage.component';

const InputImageContainer = props => <InputImage {...props} />;

const mapStateToProps = ({ app: { userData } }, ownProps) => ({
  ...ownProps,
  user: userData.email ? userData : null
});

export default connect(mapStateToProps)(InputImageContainer);
