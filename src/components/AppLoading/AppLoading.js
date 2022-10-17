import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import config from '../../config';

import './AppLoading.css';

const AppLoading = () => (
  <div className="AppLoading">
    <p className="AppLoading__main-message">{config.APP_NAME} is loading...</p>
    <div className="AppLoading__loading">
      <CircularProgress size={40} thickness={3} color="inherit" />
    </div>
  </div>
);

export default AppLoading;
