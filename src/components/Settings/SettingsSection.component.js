import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { isAndroid } from '../../cordova-util';

import './Settings.css';

export class SettingsSection extends PureComponent {
  static propTypes = {
    settings: PropTypes.array
  };

  static defaultProps = {
    settings: []
  };

  render() {
    const { subheader, settings } = this.props;
    //const settingsLength = settings.length;

    return (
      <Paper className="Settings__section">
        <List
          subheader={
            <ListSubheader>
              <FormattedMessage {...subheader} />
            </ListSubheader>
          }
        >
          {settings
            .filter(item =>
              isAndroid() && item.text.defaultMessage === 'Donate'
                ? false
                : true
            )
            .map((item, index, newSettings) => {
              const listItemProps = {
                button: true,
                onClick: item.onClick
              };

              if (item.url) {
                listItemProps.component = Link;
                listItemProps.to = item.url;
              }

              return (
                <Fragment key={index}>
                  <ListItem {...listItemProps}>
                    <div
                      className="Settings__Item__Container"
                      id={item.text.defaultMessage}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText
                        primary={<FormattedMessage {...item.text} />}
                        secondary={item.secondary}
                      />
                    </div>
                    {item.rightContent && (
                      <ListItemSecondaryAction className="Settings__section--secondaryAction">
                        {item.rightContent}
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>

                  {index !== newSettings.length - 1 && (
                    <Divider variant="inset" />
                  )}
                </Fragment>
              );
            })}
        </List>
      </Paper>
    );
  }
}

export default SettingsSection;
