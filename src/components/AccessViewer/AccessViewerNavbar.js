import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import BackButton from '../UI/BackButton';
import LockToggle from '../UI/LockToggle';
import SettingsButton from '../UI/SettingsButton';
import '../Board/Navbar/Navbar.css';

const AccessViewerNavbar = ({
  title,
  isLocked,
  disableBackButton,
  onBackClick,
  onHomeClick,
  onLockClick,
  onLockNotify,
  onCloseClick
}) => {
  return (
    <div className="Navbar">
      <div className="Navbar__group Navbar__group--start">
        <BackButton disabled={disableBackButton} onClick={onBackClick} />
        <IconButton
          disabled={disableBackButton}
          onClick={onHomeClick}
          aria-label="home"
        >
          <HomeIcon />
        </IconButton>
      </div>

      <h2 className="Navbar__title">{title}</h2>

      <div className="Navbar__group Navbar__group--end">
        {!isLocked && (
          <SettingsButton
            component={Link}
            to={{ pathname: '/settings', state: { isAccessViewerMode: true } }}
          />
        )}
        <LockToggle
          locked={isLocked}
          onLockTick={onLockNotify}
          onClick={onLockClick}
        />
        <IconButton
          onClick={onCloseClick}
          aria-label="close"
          style={{ color: '#fff' }}
        >
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  );
};

AccessViewerNavbar.propTypes = {
  title: PropTypes.string,
  isLocked: PropTypes.bool,
  disableBackButton: PropTypes.bool,
  onBackClick: PropTypes.func.isRequired,
  onHomeClick: PropTypes.func.isRequired,
  onLockClick: PropTypes.func.isRequired,
  onLockNotify: PropTypes.func,
  onCloseClick: PropTypes.func.isRequired
};

AccessViewerNavbar.defaultProps = {
  title: '',
  isLocked: true,
  disableBackButton: false,
  onLockNotify: () => {}
};

export default AccessViewerNavbar;
