import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import LanguageIcon from 'material-ui-icons/Language';
import RecordVoiceOverIcon from 'material-ui-icons/RecordVoiceOver';
import InfoOutlineIcon from 'material-ui-icons/InfoOutline';

import messages from './messages';
import FullScreenDialog from '../../components/FullScreenDialog';
import Language from './Language';
import Speech from './Speech';
import About from '../About';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      languageOpen: false,
      speechOpen: false,
      aboutOpen: false
    };
  }

  goBack = () => {
    this.setState({
      languageOpen: false,
      speechOpen: false,
      aboutOpen: false
    });
  };

  handleLanguageClick = () => {
    this.setState({ languageOpen: true });
  };

  handleSpeechClick = () => {
    this.setState({ speechOpen: true });
  };

  handleAboutClick = () => {
    this.setState({ aboutOpen: true });
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
          <ListItem button divider onClick={this.handleLanguageClick}>
            <LanguageIcon />
            <ListItemText
              primary={<FormattedMessage {...messages.language} />}
            />
          </ListItem>
          <ListItem button divider onClick={this.handleSpeechClick}>
            <RecordVoiceOverIcon />
            <ListItemText primary={<FormattedMessage {...messages.speech} />} />
          </ListItem>
          <ListItem button divider onClick={this.handleAboutClick}>
            <InfoOutlineIcon />
            <ListItemText primary={<FormattedMessage {...messages.about} />} />
          </ListItem>
        </List>
        <Language
          open={this.state.languageOpen}
          onCancel={this.goBack}
          onSubmit={this.goBack}
        />
        <Speech open={this.state.speechOpen} onCancel={this.goBack} />
        <About open={this.state.aboutOpen} onCancel={this.goBack} />
      </FullScreenDialog>
    );
  }
}

Settings.propTypes = {
  locale: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string
};

Settings.defaultProps = {};

const mapStateToProps = state => {
  return {
    locale: state.language.locale
  };
};

export default connect(mapStateToProps)(Settings);
