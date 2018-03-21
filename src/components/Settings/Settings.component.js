import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import List, {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import LanguageIcon from 'material-ui-icons/Language';
import RecordVoiceOverIcon from 'material-ui-icons/RecordVoiceOver';
import InfoOutlineIcon from 'material-ui-icons/InfoOutline';
import FileDownloadIcon from 'material-ui-icons/FileDownload';
import FeedbackIcon from 'material-ui-icons/Feedback';
import PersonIcon from 'material-ui-icons/Person';

import messages from './Settings.messages';
import FullScreenDialog from '../UI/FullScreenDialog';

import './Settings.css';

export class Settings extends PureComponent {
  handleFeedbackClick = () => {
    window.location.href = 'mailto:shayc@outlook.com?subject=Cboard feedback';
  };

  handleGoBack = () => {
    const { history } = this.props;
    history.push('/');
  };

  render() {
    return (
      <FullScreenDialog
        className="Settings"
        open
        title={<FormattedMessage {...messages.settings} />}
        onRequestClose={this.handleGoBack}
      >
        <Paper className="Settings__section">
          <List
            subheader={
              <ListSubheader>
                <FormattedMessage {...messages.people} />
              </ListSubheader>
            }
          >
            <ListItem button component={Link} to="/login-signup">
              <ListItemIcon>
                <Avatar className="ProfileAvatar">
                  <PersonIcon className="ProfileAvatar__person-icon" />
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={<FormattedMessage {...messages.guest} />}
              />
            </ListItem>
          </List>
        </Paper>

        <Paper className="Settings__section">
          <List
            subheader={
              <ListSubheader>
                <FormattedMessage {...messages.language} />
              </ListSubheader>
            }
          >
            <ListItem button component={Link} to="/settings/language">
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText
                primary={<FormattedMessage {...messages.language} />}
              />
            </ListItem>

            <Divider inset />

            <ListItem button component={Link} to="/settings/speech">
              <ListItemIcon>
                <RecordVoiceOverIcon />
              </ListItemIcon>
              <ListItemText
                primary={<FormattedMessage {...messages.speech} />}
              />
            </ListItem>

            <Divider inset />

            <ListItem button component={Link} to="/settings/backup">
              <ListItemIcon>
                <FileDownloadIcon />
              </ListItemIcon>
              <ListItemText
                primary={<FormattedMessage {...messages.backup} />}
              />
            </ListItem>
          </List>
        </Paper>

        <Paper className="Settings__section">
          <List
            subheader={
              <ListSubheader>
                <FormattedMessage {...messages.system} />
              </ListSubheader>
            }
          >
            <ListItem button component={Link} to="/settings/about">
              <ListItemIcon>
                <InfoOutlineIcon />
              </ListItemIcon>
              <ListItemText
                primary={<FormattedMessage {...messages.about} />}
              />
            </ListItem>

            <Divider inset />

            <ListItem button onClick={this.handleFeedbackClick}>
              <ListItemIcon>
                <FeedbackIcon />
              </ListItemIcon>
              <ListItemText
                primary={<FormattedMessage {...messages.feedback} />}
              />
            </ListItem>
          </List>
        </Paper>
      </FullScreenDialog>
    );
  }
}

export default Settings;
