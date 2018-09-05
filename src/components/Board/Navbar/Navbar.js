import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import isMobile from 'ismobilejs';
import { Scannable } from 'react-scannable';

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
      isFocused: false
    };
  }

  onScannableFocus = () => {
    if (!this.state.isFocused) {
      this.setState({ isFocused: true });
    }
  };

  onScannableBlur = () => {
    if (this.state.isFocused) {
      this.setState({ isFocused: false });
    }
  };

  render() {
    const {
      className,
      title,
      disabled,
      isLocked,
      onBackClick,
      onLockClick,
      onLockNotify
    } = this.props;

    return (
      <div className={classNames('Navbar', className)}>
        <h2 className="Navbar__title">{title}</h2>
        <div className="Navbar__group Navbar__group--start">
          <div className={this.state.isFocused ? 'scanner__focused' : ''}>
            <Scannable
              disabled={disabled}
              onFocus={this.onScannableFocus}
              onBlur={this.onScannableBlur}
            >
              <BackButton disabled={disabled} onClick={onBackClick} />
            </Scannable>
          </div>
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
  onLockClick: PropTypes.func
};

export default Navbar;
