import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';

import FontIcon from 'material-ui/FontIcon';
const settingsIcon = <FontIcon className="material-icons">settings</FontIcon>;
const boardIcon = <FontIcon className="material-icons">view_module</FontIcon>;
const keyboardIcon = <FontIcon className="material-icons">keyboard</FontIcon>;

class NavigationBar extends PureComponent {
  render() {
    return (
      <Paper zDepth={1}>
        <BottomNavigation selectedIndex={this.props.selectedIndex}>
          <BottomNavigationItem
            label={this.props.intl.formatMessage({ id: 'cboard.containers.App.bottomNavigationItem.settings' })}
            icon={settingsIcon}
            onTouchTap={() => this.props.select(this.props.TABS.SETTINGS)}
          />
          <BottomNavigationItem
            label={this.props.intl.formatMessage({ id: 'cboard.containers.App.bottomNavigationItem.board' })}
            icon={boardIcon}
            onTouchTap={() => this.props.select(this.props.TABS.BOARD)}
          />
          <BottomNavigationItem
            label={this.props.intl.formatMessage({ id: 'cboard.containers.App.bottomNavigationItem.keyboard' })}
            icon={keyboardIcon}
            onTouchTap={() => this.props.select(this.props.TABS.KEYBOARD)}
          />
        </BottomNavigation>
      </Paper>
    );
  }
}


NavigationBar.propTypes = {
  TABS: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  select: PropTypes.func.isRequired,
  selectedIndex: PropTypes.number
}

NavigationBar.defaultProps = {
  selectedIndex: 1
}

export default NavigationBar;
