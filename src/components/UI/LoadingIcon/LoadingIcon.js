import React from 'react';
import { CircularProgress } from 'material-ui/Progress';

import './LoadingIcon.css';

function LoadingIcon() {
  return <CircularProgress className="LoadingIcon" size={14} />;
}

export default LoadingIcon;
