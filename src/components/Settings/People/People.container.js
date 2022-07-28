import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { logout } from '../../Account/Login/Login.actions';
import { updateUserData } from '../../App/App.actions';
import People from './People.component';
import { getUser, isLogged } from '../../App/App.selectors';
import API from '../../../api';

import { isAndroid } from '../../../cordova-util';

export class PeopleContainer extends PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

  state = {
    name: this.props.user.name,
    email: this.props.user.email,
    birthdate: this.props.user.birthdate
  };

  handleChange = name => event => {
    this.setState({
      ...this.state,
      [name]: event.target.value
    });
  };

  handleSubmit = async () => {
    try {
      await API.updateUser({
        id: this.props.user.id,
        name: this.state.name,
        email: this.state.email,
        birthdate: this.state.birthdate
      });
      this.props.updateUserData({
        ...this.props.user,
        name: this.state.name,
        email: this.state.email,
        birthdate: this.state.birthdate
      });
    } catch (e) {
    } finally {
    }
  };

  handleLogout = () => {
    if (isAndroid()) {
      window.plugins.googleplus.disconnect(function(msg) {
        console.log('disconnect google msg' + msg);
      });
      window.facebookConnectPlugin.logout(
        function(msg) {
          console.log('disconnect facebook msg' + msg);
        },
        function(msg) {
          console.log('error facebook disconnect msg' + msg);
        }
      );
    }
    this.props.logout();
  };

  render() {
    const { history, isLogged } = this.props;
    const country = isLogged
      ? this.props.user?.location?.country
      : this.props.unloggedUserCountry;

    return (
      <People
        onClose={history.goBack}
        isLogged={this.props.isLogged}
        logout={this.handleLogout}
        name={this.state.name}
        email={this.state.email}
        birthdate={this.state.birthdate}
        country={country}
        onChangePeople={this.handleChange}
        onSubmitPeople={this.handleSubmit}
      />
    );
  }
}

const mapStateToProps = state => ({
  isLogged: isLogged(state),
  user: getUser(state),
  unloggedUserCountry: state.app.unloggedUserLocation?.country
});

const mapDispatchToProps = {
  logout: logout,
  updateUserData: updateUserData
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PeopleContainer);
