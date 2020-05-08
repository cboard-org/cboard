import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import classNames from 'classnames';

import Activate from '../Account/Activate';
import ChangePassword from '../Account/ChangePassword';
import OAuthLogin from '../Account/OAuthLogin';
import AuthScreen, { RedirectIfLogged } from '../AuthScreen';
import BoardContainer from '../Board';
import Notifications from '../Notifications';
import NotFound from '../NotFound';
import Settings from '../Settings';
import WelcomeScreen from '../WelcomeScreen';
import Analytics from '../Analytics';
import './App.css';

export class App extends Component {
  static propTypes = {
    /**
     * App language direction
     */
    dir: PropTypes.string.isRequired,
    /**
     * If 'true', user first visit
     */
    isFirstVisit: PropTypes.bool,
    /**
     * If 'true', user is logged in
     */
    isLogged: PropTypes.bool,
    /**
     * App language
     */
    lang: PropTypes.string.isRequired,
    /**
     * If 'true', dark mode is enabled
     */
    dark: PropTypes.bool,
  };

  render() {
    const { lang, dir, isFirstVisit, isLogged, dark } = this.props;

    return (
      <div className={classNames('App', { 'is-dark': dark })}>
        <Helmet>
          <html lang={lang} dir={dir} />
        </Helmet>

        <Notifications />

        <Switch>
          <RedirectIfLogged
            component={AuthScreen}
            isLogged={isLogged}
            path="/login-signup"
            to="/"
          />
          <Route path="/settings" component={Settings} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/activate/:url" component={Activate} />
          <Route path="/reset/:userid/:url" component={ChangePassword} />
          <Route path="/login/:type/callback" component={OAuthLogin} />
          <Route path="/board/:id" component={BoardContainer} />
          <Route
            exact
            path="/"
            component={
              isFirstVisit && !isLogged ? WelcomeScreen : BoardContainer
            }
          />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

export default App;
