import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import LockOutlineIcon from 'material-ui-icons/LockOutline';
import LockOpenIcon from 'material-ui-icons/LockOpen';

import messages from './messages';
import './Navbar.css';

const styles = {
  keyboardFocused: {
    backgroundColor: 'rgba(0,0,0,0)'
  }
};

function Navbar() {
  const {
    className,
    classes,
    intl,
    title,
    disabled,
    isLocked,
    onBackClick,
    onLockClick
  } = this.props;

  return (
    <div className={classNames(className, 'Navbar')}>
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
    </div>
  );
}

Navbar.propTypes = {
  className: PropTypes.string,
  intl: intlShape.isRequired,
  title: PropTypes.string
};

Navbar.defaultProps = {
  className: ''
};

export default injectIntl(withStyles(styles, { name: 'EditNavbar' })(Navbar));
