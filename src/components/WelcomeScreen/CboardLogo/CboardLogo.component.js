import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import { isCordova } from '../../../cordova-util';

import './CboardLogo.css';

// Cordova path cannot be absolute
const imageWhite = isCordova()
  ? './images/logo-white-slogan.png'
  : '/images/logo-white-slogan.png';

const imageViolet = isCordova()
  ? './images/logo-violet.svg'
  : '/images/logo-violet.svg';

const CboardLogo = props => {
  const [showLogo, setShowLogo] = useState(false);
  const [violetLogo, setVioletLogo] = useState(false);

  useEffect(
    () => {
      setShowLogo(true);
      if (!!props.isViolet) setVioletLogo(true);
    },
    [props.isViolet]
  );

  return (
    <CSSTransition
      in={showLogo}
      timeout={5000}
      classNames="transition"
      appear={true}
    >
      <img
        className="CboardLogo"
        src={violetLogo ? imageViolet : imageWhite}
        alt="Cboard Logo"
      />
    </CSSTransition>
  );
};

CboardLogo.propTypes = {
  isViolet: PropTypes.bool
};

export default CboardLogo;
