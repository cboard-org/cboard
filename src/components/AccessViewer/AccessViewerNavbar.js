import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape } from 'react-intl';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';

import BackButton from '../UI/BackButton';
import LockToggle from '../UI/LockToggle';
import SettingsButton from '../UI/SettingsButton';
import '../Board/Navbar/Navbar.css';

const AccessViewerNavbar = ({
  intl,
  title,
  isLocked,
  disableBackButton,
  onBackClick,
  onHomeClick,
  onLockClick,
  onLockNotify
}) => {
  return (
    <div className="Navbar">
      <div className="Navbar__group Navbar__group--start">
        <BackButton disabled={disableBackButton} onClick={onBackClick} />
        <IconButton
          disabled={disableBackButton}
          onClick={onHomeClick}
          aria-label="home"
          style={{ color: '#fff' }}
        >
          <HomeIcon />
        </IconButton>
      </div>

      <h2 className="Navbar__title">{title}</h2>

      <div className="Navbar__group Navbar__group--end">
        {!isLocked && (
          <SettingsButton
            component={Link}
            to={{ pathname: '/settings', state: { viewerMode: true } }}
          />
        )}
        <LockToggle
          locked={isLocked}
          onLockTick={onLockNotify}
          onClick={onLockClick}
        />
      </div>
    </div>
  );
};

AccessViewerNavbar.propTypes = {
  intl: intlShape.isRequired,
  title: PropTypes.string,
  isLocked: PropTypes.bool,
  disableBackButton: PropTypes.bool,
  onBackClick: PropTypes.func.isRequired,
  onHomeClick: PropTypes.func.isRequired,
  onLockClick: PropTypes.func.isRequired,
  onLockNotify: PropTypes.func
};

AccessViewerNavbar.defaultProps = {
  title: '',
  isLocked: true,
  disableBackButton: false,
  onLockNotify: () => {}
};

export default injectIntl(AccessViewerNavbar);
