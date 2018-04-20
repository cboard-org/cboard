import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
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

const propTypes = {
  isLogged: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export class Settings extends PureComponent {
  getSettingsSections() {
    const { isLogged, logout, user } = this.props;

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
            secondary: isLogged ? user.name : null,
            text: isLogged ? messages.username : messages.guest,
            rightContent: isLogged ? (
              <Button color="secondary" onClick={logout}>
                <FormattedMessage {...messages.logoutBtn} />
              </Button>
            ) : (
              <Button color="primary" component={Link} to="/login-signup">
                <FormattedMessage {...messages.loginSignupBtn} />
              </Button>
            )
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
        onClose={this.handleGoBack}
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

Settings.propTypes = propTypes;

export default Settings;
