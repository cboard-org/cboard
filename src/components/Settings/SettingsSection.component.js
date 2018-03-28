import React, { PureComponent, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import List, {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

import './Settings.css';

export class SettingsSection extends PureComponent {
  render() {
    const { subheader, settings } = this.props;

    return (
      <Paper className="Settings__section">
        <List
          subheader={
            <ListSubheader>
              <FormattedMessage {...subheader} />
            </ListSubheader>
          }
        >
          {settings.map((item, index, array) => {
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
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={<FormattedMessage {...item.text} />} />
                </ListItem>
                {index !== array.length - 1 && <Divider inset />}
              </Fragment>
            );
          })}
        </List>
      </Paper>
    );
  }
}

export default SettingsSection;
