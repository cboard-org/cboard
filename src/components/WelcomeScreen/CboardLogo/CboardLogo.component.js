import React from 'react';
import { isCordova } from '../../../cordova-util';

import './CboardLogo.css';

// Cordova path cannot be absolute
const image = isCordova()
  ? './images/logo_no_words.svg'
  : '/images/logo_no_words.svg';

const CboardLogo = () => (
  <img className="CboardLogo" src={image} alt="Cboard Logo" />
);

export default CboardLogo;
