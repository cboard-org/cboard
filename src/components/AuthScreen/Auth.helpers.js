import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({
  component: Component,
  isLogged,
  to = '/login-signup',
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      isLogged ? <Component {...props} /> : <Redirect to={to} />
    }
  />
);

export const RedirectIfLogged = ({
  component: Component,
  isLogged,
  to = '/',
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      isLogged ? <Redirect to={to} /> : <Component {...props} />
    }
  />
);
