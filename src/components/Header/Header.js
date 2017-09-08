import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  children: PropTypes.node
};

const styles = {
  AppBar: {
    position: 'relative',
    top: 0
  }
};

function Header({ classes, className, children }) {
  return (
    <AppBar className={classNames('Header', className, classes.AppBar)}>
      <Toolbar>
        {children}
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(styles, { name: 'Header' })(Header);
