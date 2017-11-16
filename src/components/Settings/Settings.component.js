import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import LanguageIcon from 'material-ui-icons/Language';
import RecordVoiceOverIcon from 'material-ui-icons/RecordVoiceOver';
import InfoOutlineIcon from 'material-ui-icons/InfoOutline';
import FileDownloadIcon from 'material-ui-icons/FileDownload';

import messages from './Settings.messages';
import FullScreenDialog from '../FullScreenDialog';
import Language from './Language';
import Speech from './Speech';
import Backup from './Backup';
import About from '../About';

import './Settings.css';

const propTypes = {
  boards: PropTypes.array,

  aboutOpen: PropTypes.bool,
  backupOpen: PropTypes.bool,
  languageOpen: PropTypes.bool,
  settingsOpen: PropTypes.bool,
  speechOpen: PropTypes.bool,

  onAboutClick: PropTypes.func,
  onBackupClick: PropTypes.func,
  onGoBackClick: PropTypes.func,
  onImportClick: PropTypes.func,
  onLanguageClick: PropTypes.func,
  onRequestClose: PropTypes.func,
  onSpeechClick: PropTypes.func
};

const Settings = ({
  boards,

  aboutOpen,
  backupOpen,
  languageOpen,
  settingsOpen,
  speechOpen,

  onAboutClick,
  onBackupClick,
  onGoBackClick,
  onImportClick,
  onLanguageClick,
  onRequestClose,
  onSpeechClick
}) => (
  <FullScreenDialog
    className="Settings"
    open={settingsOpen}
    title={<FormattedMessage {...messages.settings} />}
    onRequestClose={onRequestClose}
  >
    <div className="Settings__content">
      <List
        subheader={
          <ListSubheader>
            <FormattedMessage {...messages.settings} />
          </ListSubheader>
        }
      >
        <ListItem button onClick={onLanguageClick}>
          <Avatar>
            <LanguageIcon />
          </Avatar>
          <ListItemText primary={<FormattedMessage {...messages.language} />} />
        </ListItem>

        <Divider inset />

        <ListItem button onClick={onSpeechClick}>
          <Avatar>
            <RecordVoiceOverIcon />
          </Avatar>
          <ListItemText primary={<FormattedMessage {...messages.speech} />} />
        </ListItem>

        <Divider inset />

        <ListItem button onClick={onBackupClick}>
          <Avatar>
            <FileDownloadIcon />
          </Avatar>
          <ListItemText primary={<FormattedMessage {...messages.backup} />} />
        </ListItem>

        <Divider inset />

        <ListItem button onClick={onAboutClick}>
          <Avatar>
            <InfoOutlineIcon />
          </Avatar>
          <ListItemText primary={<FormattedMessage {...messages.about} />} />
        </ListItem>
      </List>
    </div>
    <Language
      open={languageOpen}
      onRequestClose={onGoBackClick}
      onSubmit={onGoBackClick}
    />
    <Speech open={speechOpen} onRequestClose={onGoBackClick} />
    <Backup
      boards={boards}
      open={backupOpen}
      onImportClick={onImportClick}
      onRequestClose={onGoBackClick}
    />
    <About open={aboutOpen} onRequestClose={onGoBackClick} />
  </FullScreenDialog>
);

Settings.propTypes = propTypes;

export default Settings;
