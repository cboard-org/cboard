import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import { isPackagedApp } from '../../../cordova-util';

import './CboardLogo.css';

// Packaged-app asset paths must be relative (served over file://).
const imageWhite = isPackagedApp()
  ? './images/logo-white-slogan.png'
  : '/images/logo-white-slogan.png';

const imageViolet = isPackagedApp()
  ? './images/logo-violet.svg'
  : '/images/logo-violet.svg';

const CboardLogo = (props) => {
  const [showLogo, setShowLogo] = useState(false);
  const [violetLogo, setVioletLogo] = useState(false);

  useEffect(() => {
    setShowLogo(true);
    if (!!props.isViolet) setVioletLogo(true);
  }, [props.isViolet]);

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
