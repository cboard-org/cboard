import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
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
import IconButton from '../UI/IconButton';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';

import messages from './Settings.messages';
import SettingsSection from './SettingsSection.component';
import FullScreenDialog from '../UI/FullScreenDialog';
import UserIcon from '../UI/UserIcon';
import SettingsTour from './SettingsTour.component';

import { isAndroid } from '../../cordova-util';

import './Settings.css';

const propTypes = {
  isLogged: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  intl: intlShape.isRequired
};

export class Settings extends PureComponent {
  getSettingsSections() {
    const { isLogged, logout, user } = this.props;

    function handleLogOutClick() {
      if (isAndroid()) {
        window.plugins.googleplus.disconnect(function(msg) {
          console.log('disconnect msg' + msg);
        });
      }
      logout();
    }

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
              <Button
                color="primary"
                onClick={handleLogOutClick}
                variant="outlined"
              >
                <FormattedMessage {...messages.logout} />
              </Button>
            ) : (
              <Button
                color="primary"
                variant="outlined"
                component={Link}
                to="/login-signup"
              >
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
            url: '/settings/help'
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

  handleGoBack = () => {
    const { history } = this.props;
    history.replace('/');
  };

  enableTour = () => {
    const { disableTour } = this.props;
    disableTour({ isSettingsTourEnabled: true });
  };

  render() {
    const { intl, disableTour, isSettingsTourEnabled, location } = this.props;
    const isSettingsLocation = location.pathname === '/settings';
    return (
      <FullScreenDialog
        className="Settings"
        open
        title={<FormattedMessage {...messages.settings} />}
        onClose={this.handleGoBack}
        buttons={
          isSettingsLocation &&
          !isSettingsTourEnabled && (
            <div className="Settings_EnableTour_Button">
              <IconButton
                label={intl.formatMessage(messages.enableTour)}
                onClick={this.enableTour} //Enable tour
              >
                <LiveHelpIcon />
              </IconButton>
            </div>
          )
        }
      >
        {this.getSettingsSections().map(({ subheader, settings }, index) => (
          <SettingsSection
            subheader={subheader}
            settings={settings}
            key={index}
          />
        ))}
        {isSettingsLocation && isSettingsTourEnabled && (
          <SettingsTour
            intl={intl}
            disableTour={disableTour}
            isSettingsTourEnabled={isSettingsTourEnabled}
          />
        )}
      </FullScreenDialog>
    );
  }
}

Settings.propTypes = propTypes;

export default Settings;
