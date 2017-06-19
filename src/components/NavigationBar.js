import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';

const settingsIcon = <FontIcon className="material-icons">settings</FontIcon>;
const boardIcon = <FontIcon className="material-icons">view_module</FontIcon>;
const keyboardIcon = <FontIcon className="material-icons">keyboard</FontIcon>;

function NavigationBar({ TABS, intl, select, selectedIndex }) {
  return (
    <Paper zDepth={1}>
      <BottomNavigation selectedIndex={selectedIndex}>
        <BottomNavigationItem
          label={intl.formatMessage({ id: 'cboard.containers.App.bottomNavigationItem.settings' })}
          icon={settingsIcon}
          style={{ paddingTop: 6 }} // TODO
          onTouchTap={() => select(TABS.SETTINGS)}
        />
        <BottomNavigationItem
          label={intl.formatMessage({ id: 'cboard.containers.App.bottomNavigationItem.board' })}
          icon={boardIcon}
          style={{ paddingTop: 6 }} // TODO
          onTouchTap={() => select(TABS.BOARD)}
        />
        <BottomNavigationItem
          label={intl.formatMessage({ id: 'cboard.containers.App.bottomNavigationItem.keyboard' })}
          icon={keyboardIcon}
          style={{ paddingTop: 6 }} // TODO
          onTouchTap={() => select(TABS.KEYBOARD)}
        />
      </BottomNavigation>
    </Paper>
  );
}

NavigationBar.propTypes = {
  TABS: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  select: PropTypes.func.isRequired,
  selectedIndex: PropTypes.number,
};

NavigationBar.defaultProps = {
  selectedIndex: 1,
};

export default NavigationBar;
