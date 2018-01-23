import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import LockOutlineIcon from 'material-ui-icons/LockOutline';
import LockOpenIcon from 'material-ui-icons/LockOpen';
import SettingsIcon from 'material-ui-icons/Settings';

import messages from './Navbar.messages';
import './Navbar.css';

Navbar.propTypes = {
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * @ignore
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  intl: intlShape.isRequired,
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
  /**
   * Callback fired when clicking on settings button
   */
  onSettingsClick: PropTypes.func
};

function Navbar({
  className,
  classes,
  intl,
  title,
  disabled,
  isLocked,
  onBackClick,
  onLockClick,
  onSettingsClick
}) {
  return (
    <div className={classNames('Navbar', className)}>
      <h2 className="Navbar__title">{title}</h2>
      <div className="Navbar__group Navbar__group--start">
        {!disabled && (
          <Tooltip title={intl.formatMessage(messages.back)} placement="bottom">
            <IconButton
              className="back-button"
              focusRipple={true}
              aria-label={intl.formatMessage(messages.back)}
              onClick={onBackClick}
              color="inherit"
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        )}

        {disabled && (
          <IconButton
            className="back-button"
            focusRipple={true}
            aria-label={intl.formatMessage(messages.back)}
            disabled={disabled}
            onClick={onBackClick}
            color="inherit"
            style={{
              color: 'rgba(255, 255, 255, 0.26)'
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
      </div>
      <div className="Navbar__group Navbar__group--end">
        {!isLocked && (
          <Tooltip
            title={intl.formatMessage(messages.settings)}
            placement="bottom"
          >
            <IconButton
              focusRipple={true}
              aria-label={intl.formatMessage(messages.settings)}
              color="inherit"
              onClick={onSettingsClick}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={intl.formatMessage(messages.lock)} placement="bottom">
          <IconButton
            focusRipple={true}
            aria-label={intl.formatMessage(messages.lock)}
            color="inherit"
            onClick={onLockClick}
          >
            {isLocked ? <LockOutlineIcon /> : <LockOpenIcon />}
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}

export default injectIntl(Navbar);
