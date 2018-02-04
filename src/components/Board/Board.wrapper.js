import React from 'react';
import { Route, Switch } from 'react-router-dom';
import BoardContainer from './Board.container';
import Settings from '../Settings';

const BoardWrapper = () => (
  <Switch>
    <Route exact path="/" component={BoardContainer} />
    <Route path="/settings" component={Settings} />
  </Switch>
);

export default BoardWrapper;
