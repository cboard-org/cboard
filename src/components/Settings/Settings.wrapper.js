import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SettingsContainer from './Settings.container';
import Language from './Language';
import Speech from './Speech';

const SettingsWrapper = ({ match }) => (
  <Switch>
    <Route exact path={`${match.url}`} component={SettingsContainer} />
    <Route path={`${match.url}/language`} component={Language} />
    <Route path={`${match.url}/speech`} component={Speech} />
  </Switch>
);

export default SettingsWrapper;
