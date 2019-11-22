import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import './AppLoading.css';

const AppLoading = () => (
  <div className="AppLoading">
    <p className="AppLoading__main-message">Cboard is loading...</p>
    <div className="AppLoading__loading">
      <CircularProgress size={40} thickness={3} color="inherit" />
    </div>
  </div>
);

export default AppLoading;
