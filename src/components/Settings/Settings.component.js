import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import Avatar from 'material-ui/Avatar';
import LanguageIcon from '@material-ui/icons/Language';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import InfoOutlineIcon from '@material-ui/icons/InfoOutline';
import FileDownloadIcon from '@material-ui/icons/FileDownload';
import FeedbackIcon from '@material-ui/icons/Feedback';
import PersonIcon from '@material-ui/icons/Person';

import messages from './Settings.messages';
import SettingsSection from './SettingsSection.component';
import FullScreenDialog from '../UI/FullScreenDialog';

import './Settings.css';

export class Settings extends PureComponent {
  getSettingsSections() {
    return [
      {
        subheader: messages.people,
        settings: [
          {
            icon: (
              <Avatar>
                <PersonIcon />
              </Avatar>
            ),
            text: messages.guest,
            url: '/login-signup'
          }
        ]
      },
      {
        subheader: messages.language,
        settings: [
          {
            icon: <LanguageIcon />,
            text: messages.language,
            url: '/settings/language'
          },
          {
            icon: <RecordVoiceOverIcon />,
            text: messages.speech,
            url: '/settings/speech'
          },
          {
            icon: <FileDownloadIcon />,
            text: messages.backup,
            url: '/settings/backup'
          }
        ]
      },
      {
        subheader: messages.system,
        settings: [
          {
            icon: <InfoOutlineIcon />,
            text: messages.about,
            url: '/settings/about'
          },
          {
            icon: <FeedbackIcon />,
            text: messages.feedback,
            onClick: this.handleFeedbackClick
          }
        ]
      }
    ];
  }

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
        {this.getSettingsSections().map(({ subheader, settings }, index) => (
          <SettingsSection
            subheader={subheader}
            settings={settings}
            key={index}
          />
        ))}
      </FullScreenDialog>
    );
  }
}

export default Settings;
