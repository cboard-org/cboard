import React from 'react';
import { isCordova } from '../../../cordova-util';

import './CboardLogo.css';

// Cordova path cannot be absolute
const image = isCordova()
  ? './images/artwork/logo_1x.png'
  : '/images/artwork/logo_1x.png';

const CboardLogo = () => (
  <img className="CboardLogo" src={image} alt="Cboard Logo" />
);

export default CboardLogo;
