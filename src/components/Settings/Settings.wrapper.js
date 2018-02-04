import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SettingsContainer from './Settings.container';
import Language from './Language';

const SettingsWrapper = ({ match, ...rest }) => (
  <Switch>
    <Route exact path={`${match.url}`} component={SettingsContainer} />
    <Route path={`${match.url}/language`} component={Language} />
  </Switch>
);

export default SettingsWrapper;
