import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import LanguageIcon from 'material-ui-icons/Language';
import RecordVoiceOverIcon from 'material-ui-icons/RecordVoiceOver';
import InfoOutlineIcon from 'material-ui-icons/InfoOutline';
import FileDownloadIcon from 'material-ui-icons/FileDownload';

import { importBoards } from '../Board/actions';
import messages from './messages';
import FullScreenDialog from '../../components/FullScreenDialog';
import Language from './Language';
import Speech from './Speech';
import Backup from './Backup';
import About from '../About';

export class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      languageOpen: false,
      speechOpen: false,
      backupOpen: false,
      aboutOpen: false
    };
  }

  goBack = () => {
    this.setState({
      languageOpen: false,
      speechOpen: false,
      backupOpen: false,
      aboutOpen: false
    });
  };

  handleLanguageClick = () => {
    this.setState({ languageOpen: true });
  };

  handleSpeechClick = () => {
    this.setState({ speechOpen: true });
  };

  handleBackupClick = () => {
    this.setState({ backupOpen: true });
  };

  handleAboutClick = () => {
    this.setState({ aboutOpen: true });
  };

  handleImportClick = () => {
    // const { importBoards } = this.props;
    // importing boards from external file
    console.log('Not implemented');
    // importBoards({});
  };

  render() {
    const { open, onCancel } = this.props;

    return (
      <FullScreenDialog
        className="Settings"
        open={open}
        title={<FormattedMessage {...messages.settings} />}
        onCancel={onCancel}
      >
        <List
          subheader={
            <ListSubheader>
              <FormattedMessage {...messages.settings} />
            </ListSubheader>
          }
        >
          <ListItem button onClick={this.handleLanguageClick}>
            <Avatar>
              <LanguageIcon />
            </Avatar>
            <ListItemText
              primary={<FormattedMessage {...messages.language} />}
            />
          </ListItem>

          <Divider inset />

          <ListItem button onClick={this.handleSpeechClick}>
            <Avatar>
              <RecordVoiceOverIcon />
            </Avatar>
            <ListItemText primary={<FormattedMessage {...messages.speech} />} />
          </ListItem>

          <Divider inset />

          <ListItem button onClick={this.handleBackupClick}>
            <Avatar>
              <FileDownloadIcon />
            </Avatar>
            <ListItemText primary={<FormattedMessage {...messages.backup} />} />
          </ListItem>

          <Divider inset />

          <ListItem button onClick={this.handleAboutClick}>
            <Avatar>
              <InfoOutlineIcon />
            </Avatar>
            <ListItemText primary={<FormattedMessage {...messages.about} />} />
          </ListItem>
        </List>
        <Language
          open={this.state.languageOpen}
          onCancel={this.goBack}
          onSubmit={this.goBack}
        />
        <Speech open={this.state.speechOpen} onCancel={this.goBack} />
        <Backup
          boards={this.props.boards}
          open={this.state.backupOpen}
          onImport={this.handleImportClick}
          onCancel={this.goBack}
        />
        <About open={this.state.aboutOpen} onCancel={this.goBack} />
      </FullScreenDialog>
    );
  }
}

Settings.propTypes = {
  locale: PropTypes.string,
  boards: PropTypes.array,
  children: PropTypes.node,
  className: PropTypes.string
};

Settings.defaultProps = {};

const mapStateToProps = state => {
  return {
    locale: state.language.locale,
    boards: state.board.boards
  };
};

const mapDispatchToProps = dispatch => {
  return {
    importBoards: boards => dispatch(importBoards(boards))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
