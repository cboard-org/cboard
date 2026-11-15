import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const RedirectIfLogged = ({
  component: Component,
  isLogged,
  to = '/',
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      isLogged ? <Redirect to={to} /> : <Component {...props} />
    }
  />
);
