import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import LanguageIcon from '@material-ui/icons/Language';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ScanningIcon from '@material-ui/icons/CenterFocusStrong';
import NavigationIcon from '@material-ui/icons/ChevronRight';
import FeedbackIcon from '@material-ui/icons/Feedback';
import PersonIcon from '@material-ui/icons/Person';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import HelpIcon from '@material-ui/icons/Help';

import messages from './Settings.messages';
import SettingsSection from './SettingsSection.component';
import FullScreenDialog from '../UI/FullScreenDialog';
import UserIcon from '../UI/UserIcon';

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
              <div className="Settings__UserIcon__Container">
                <UserIcon link={false} accountIcon={PersonIcon} />
              </div>
            ),
            secondary: isLogged ? user.name : null,
            text: isLogged ? messages.username : messages.guest,
            url: '/settings/people',
            rightContent: isLogged ? (
              <Button color="secondary" onClick={logout}>
                <FormattedMessage {...messages.logout} />
              </Button>
            ) : (
              <Button color="primary" component={Link} to="/login-signup">
                <FormattedMessage {...messages.loginSignup} />
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
          }
        ]
      },
      {
        subheader: messages.system,
        settings: [
          {
            icon: <CloudUploadIcon />,
            text: messages.export,
            url: '/settings/export'
          },
          {
            icon: <CloudDownloadIcon />,
            text: messages.import,
            url: '/settings/import'
          },
          {
            icon: <VisibilityIcon />,
            text: messages.display,
            url: '/settings/display'
          },
          {
            icon: <ScanningIcon />,
            text: messages.scanning,
            url: '/settings/scanning'
          },
          {
            icon: <NavigationIcon />,
            text: messages.navigation,
            url: '/settings/navigation'
          }
        ]
      },
      {
        subheader: messages.help,
        settings: [
          {
            icon: <HelpIcon />,
            text: messages.userHelp,
            onClick: this.handleUserHelpClick
          },
          {
            icon: <InfoOutlinedIcon />,
            text: messages.about,
            url: '/settings/about'
          },
          {
            icon: <MonetizationOnIcon />,
            text: messages.donate,
            onClick: this.handleDonateClick
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
    window.location.href = 'mailto:support@cboard.io?subject=Cboard feedback';
  };
  handleDonateClick = () => {
    window.open('https://opencollective.com/cboard#backer', '_blank');
  };
  handleUserHelpClick = () => {
    window.open('https://www.cboard.io/help', '_blank');
  };

  handleGoBack = () => {
    const { history } = this.props;
    history.replace('/');
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
