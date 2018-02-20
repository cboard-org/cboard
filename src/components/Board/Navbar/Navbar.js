import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import LockOutlineIcon from 'material-ui-icons/LockOutline';
import LockOpenIcon from 'material-ui-icons/LockOpen';
import UndoIcon from 'material-ui-icons/Undo';

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
  onLockClick: PropTypes.func
};

const styles = {
  keyboardFocused: {
    backgroundColor: 'rgba(0,0,0,0)'
  }
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
  onUndoClick
}) {
  return (
    <div className={classNames('Navbar', className)}>
      <h2 className="Navbar__title">{title}</h2>
      <div className="Navbar__group Navbar__group--start">
        <IconButton
          className="back-button"
          focusRipple={true}
          classes={{ keyboardFocused: classes.keyboardFocused }}
          aria-label={intl.formatMessage(messages.back)}
          title={intl.formatMessage(messages.back)}
          disabled={disabled}
          onClick={onBackClick}
          color="contrast"
          style={{
            opacity: disabled ? 0.3 : 1
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </div>
      <div className="Navbar__group Navbar__group--end">
        <IconButton
          classes={{ keyboardFocused: classes.keyboardFocused }}
          focusRipple={true}
          aria-label={intl.formatMessage(messages.lock)}
          title={intl.formatMessage(messages.lock)}
          color="contrast"
          onClick={onLockClick}
        >
          {isLocked ? <LockOutlineIcon /> : <LockOpenIcon />}
        </IconButton>
      </div>

      <div className="Navbar__group Navbar__group--end">
        <IconButton
          classes={{ keyboardFocused: classes.keyboardFocused }}
          focusRipple={true}
          aria-label={intl.formatMessage(messages.undo)}
          title={intl.formatMessage(messages.undo)}
          color="contrast"
          onClick={onUndoClick}
        >
          <UndoIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default injectIntl(withStyles(styles, { name: 'EditNavbar' })(Navbar));
