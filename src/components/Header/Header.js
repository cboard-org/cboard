import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';

const styleSheet = createStyleSheet('Header', {
  AppBar: {
    position: 'relative',
    top: 0
  }
});

function Header({ classes, className, children }) {
  return (
    <AppBar className={classNames('Header', className, classes.AppBar)}>
      <Toolbar>
        {children}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  children: PropTypes.node
};

export default withStyles(styleSheet)(Header);
