import React from 'react';
import { connect } from 'react-redux';
import UserIcon from './UserIcon.component';

const UserIconContainer = props => <UserIcon {...props} />;

const mapStateToProps = ({ app: { userData } }, ownProps) => ({
  ...ownProps,
  user: userData.email ? userData : null
});

export default connect(mapStateToProps)(UserIconContainer);
