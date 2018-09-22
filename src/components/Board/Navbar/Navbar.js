import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import isMobile from 'ismobilejs';
import { Scannable } from 'react-scannable';
import { IconButton } from '@material-ui/core';
import ScannerDeactivateIcon from '@material-ui/icons/ExploreOff';

import FullScreenButton from '../../UI/FullScreenButton';
import PrintBoardButton from '../../UI/PrintBoardButton';
import LockToggle from '../../UI/LockToggle';
import BackButton from '../../UI/BackButton';
import SettingsButton from '../../UI/SettingsButton';

import './Navbar.css';

class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backButton: false,
      deactivateScannerButton: false
    };
  }

  onScannableFocus = property => () => {
    if (!this.state[property]) {
      this.setState({ [property]: true });
    }
  };

  onScannableBlur = property => () => {
    if (this.state[property]) {
      this.setState({ [property]: false });
    }
  };

  render() {
    const {
      className,
      title,
      disabled,
      isLocked,
      isScannerActive,
      onBackClick,
      onDeactivateScannerClick,
      onLockClick,
      onLockNotify
    } = this.props;

    return (
      <div className={classNames('Navbar', className)}>
        {isLocked && <h2 className="Navbar__title">{title}</h2>}
        <div className="Navbar__group Navbar__group--start">
          <div className={this.state.backButton ? 'scanner__focused' : ''}>
            <Scannable
              disabled={disabled}
              onFocus={this.onScannableFocus('backButton')}
              onBlur={this.onScannableBlur('backButton')}
            >
              <BackButton disabled={disabled} onClick={onBackClick} />
            </Scannable>
          </div>
          {isScannerActive && (
            <div
              className={
                this.state.deactivateScannerButton ? 'scanner__focused' : ''
              }
            >
              <Scannable
                onFocus={this.onScannableFocus('deactivateScannerButton')}
                onBlur={this.onScannableBlur('deactivateScannerButton')}
              >
                <IconButton
                  className="Navbar__deactivateScanner"
                  onClick={onDeactivateScannerClick}
                >
                  <ScannerDeactivateIcon />
                </IconButton>
              </Scannable>
            </div>
          )}
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
}

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
  onLockClick: PropTypes.func,
  isScannerActive: PropTypes.bool,
  onDeactivateScannerClick: PropTypes.func
};

export default Navbar;
