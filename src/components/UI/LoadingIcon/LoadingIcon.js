import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import './LoadingIcon.css';

function LoadingIcon() {
  return <CircularProgress className="LoadingIcon" size={14} />;
}

export default LoadingIcon;
