import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';

import Settings from './Settings.container';
import People from './People';
import Language from './Language';
import Speech from './Speech';
import Export from './Export';
import Import from './Import';
import Display from './Display';
import About from './About';
import Scanning from './Scanning';
import Navigation from './Navigation';
import Help from './Help';

const SettingsWrapper = ({ match }) => (
  <Fragment>
    <Route exact component={Settings} />
    <Switch>
      <Route path={`${match.url}/people`} component={People} />
      <Route path={`${match.url}/language`} component={Language} />
      <Route path={`${match.url}/speech`} component={Speech} />
      <Route path={`${match.url}/export`} component={Export} />
      <Route path={`${match.url}/import`} component={Import} />
      <Route path={`${match.url}/display`} component={Display} />
      <Route path={`${match.url}/about`} component={About} />
      <Route path={`${match.url}/help`} component={Help} />
      <Route path={`${match.url}/scanning`} component={Scanning} />
      <Route path={`${match.url}/navigation`} component={Navigation} />
    </Switch>
  </Fragment>
);

export default SettingsWrapper;
