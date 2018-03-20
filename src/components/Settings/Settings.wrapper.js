import React from 'react';
import { Route, Switch } from 'react-router-dom';

import SettingsContainer from './Settings.container';
import People from './People';
import Backup from './Backup';
import Language from './Language';
import Speech from './Speech';
import About from '../About';

const SettingsWrapper = ({ match }) => [
  <Route exact component={SettingsContainer} />,
  <Switch>
    <Route path={`${match.url}/people`} component={People} />
    <Route path={`${match.url}/language`} component={Language} />
    <Route path={`${match.url}/speech`} component={Speech} />
    <Route path={`${match.url}/backup`} component={Backup} />
    <Route path={`${match.url}/about`} component={About} />
  </Switch>
];

export default SettingsWrapper;
