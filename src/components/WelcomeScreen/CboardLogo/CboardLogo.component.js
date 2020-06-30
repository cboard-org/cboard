import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

import { isCordova } from '../../../cordova-util';

import './CboardLogo.css';

// Cordova path cannot be absolute
const image = isCordova()
  ? './images/logo_no_words.svg'
  : '/images/logo_no_words.svg';

const CboardLogo = () => {

  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    setShowLogo(true);
  }, []);

  return (
    <CSSTransition
      in={showLogo}
      timeout={5000}
      classNames="transition"
      appear={true}
    >
      <img className="CboardLogo" src={image} alt="Cboard Logo" />
    </CSSTransition>
  );
}

export default CboardLogo;
