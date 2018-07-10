import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import isMobile from 'ismobilejs';

import FullScreenButton from '../../UI/FullScreenButton';
import PrintBoardButton from '../../UI/PrintBoardButton';
import LockToggle from '../../UI/LockToggle';
import BackButton from '../../UI/BackButton';
import SettingsButton from '../../UI/SettingsButton';
import './Navbar.css';

Navbar.propTypes = {
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * Bar title
   */
  title: PropTypes.string,
  /**
   * If disabled, navigation is disabled
   */
  disabled: PropTypes.bool,
  /**
   * If enabled, navigation bar is locked Todo: shouldn't be here - mixing concerns
   */
  isLocked: PropTypes.bool,
  /**
   * Callback fired when clicking on back button
   */
  onBackClick: PropTypes.func,
  /**
   * Callback fired when clicking on lock button
   */
  onLockClick: PropTypes.func
};

function Navbar({
  className,
  title,
  disabled,
  isLocked,
  onBackClick,
  onLockClick,
  onLockNotify
}) {
  return (
    <div className={classNames('Navbar', className)}>
      <h2 className="Navbar__title">{title}</h2>
      <div className="Navbar__group Navbar__group--start">
        <BackButton disabled={disabled} onClick={onBackClick} />
      </div>
      <div className="Navbar__group Navbar__group--end">
        {!isLocked && <PrintBoardButton />}

        {!isLocked && !isMobile.any && <FullScreenButton />}

        {!isLocked && <SettingsButton component={Link} to="/settings" />}

        <LockToggle
          locked={isLocked}
          onLockTick={onLockNotify}
          onClick={onLockClick}
        />
      </div>
    </div>
  );
}

export default Navbar;
