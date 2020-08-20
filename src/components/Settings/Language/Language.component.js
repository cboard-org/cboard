import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ISO6391 from 'iso-639-1';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import CheckIcon from '@material-ui/icons/Check';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Slide from '@material-ui/core/Slide';
import ReactMarkdown from 'react-markdown';

import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Language.messages';
import { isCordova } from '../../../cordova-util';

import './../Settings.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Language extends React.Component {
  static propTypes = {
    /**
     * Languages to display
     */
    langs: PropTypes.arrayOf(PropTypes.string),
    /**
     * Selected language
     */
    selectedLang: PropTypes.string,
    /**
     * Callback fired when clicking on a language item
     */
    onLangClick: PropTypes.func.isRequired,
    /**
     * Callback fired when clicking the back button
     */
    onClose: PropTypes.func.isRequired,
    /**
     * Callback fired when submitting selected language
     */
    onSubmitLang: PropTypes.func.isRequired,
    language: PropTypes.object.isRequired
  };

  static defaultProps = {
    langs: [],
    selectedLang: ''
  };

  constructor(props) {
    super(props);

    this.state = {
      moreLangDialog: false,
      markdown: ''
    };
  }

  componentDidMount() {
    let readmePath = '';
    try {
      readmePath = require(`../../../translations/moreLanguages/${
        this.props.language.lang
      }.md`);
    } catch (err) {
      readmePath = require(`../../../translations/moreLanguages/en-US.md`);
    } finally {
      if (isCordova()) {
        const req = new XMLHttpRequest();
        req.onload = () => {
          const text = req.responseText;
          this.setState({ markdown: text });
        };
        req.open('GET', readmePath);
        req.send();
      } else {
        fetch(readmePath)
          .then(response => {
            return response.text();
          })
          .then(text => {
            this.setState({ markdown: text });
          });
      }
    }
  }

  handleMoreLangClick() {
    this.setState({ moreLangDialog: true });
  }

  handleMoreLangClose() {
    this.setState({ moreLangDialog: false });
  }

  render() {
    const {
      langs,
      selectedLang,
      onLangClick,
      onClose,
      onSubmitLang
    } = this.props;
    const langItems = langs.map((lang, index, array) => {
      const locale = lang.slice(0, 2).toLowerCase();
      const showLangCode =
        langs.filter(langCode => langCode.slice(0, 2).toLowerCase() === locale)
          .length > 1;

      const langCode = showLangCode ? `(${lang})` : '';
      let nativeName = `${ISO6391.getNativeName(locale)} ${langCode}`;
      //handle custom native name
      if (lang === 'sr-ME') {
        nativeName = 'Crnogorski jezik';
      } else if (lang === 'sr-SP') {
        nativeName = `Српски језик ${langCode}`;
      } else if (lang === 'sr-RS') {
        nativeName = `Srpski jezik ${langCode}`;
      }

      return (
        <ListItem
          button
          divider={index !== array.length - 1}
          onClick={() => onLangClick(lang)}
          key={index}
        >
          <ListItemText
            primary={nativeName}
            secondary={<FormattedMessage {...messages[locale]} />}
          />
          {selectedLang === lang && <CheckIcon />}
        </ListItem>
      );
    });
    return (
      <FullScreenDialog
        open
        title={<FormattedMessage {...messages.language} />}
        onClose={onClose}
        onSubmit={onSubmitLang}
      >
        <Paper>
          <List>{langItems}</List>
        </Paper>
        <div className="Settings__Language__MoreLang">
          <Button color="primary" onClick={this.handleMoreLangClick.bind(this)}>
            <FormattedMessage {...messages.moreLanguages} />
          </Button>
        </div>
        <Dialog
          onClose={this.handleMoreLangClose.bind(this)}
          aria-labelledby="more-languages-dialog"
          open={this.state.moreLangDialog}
          TransitionComponent={Transition}
          aria-describedby="more-languages-dialog-desc"
        >
          <DialogTitle
            id="more-languages-dialog-title"
            onClose={this.handleMoreLangClose.bind(this)}
          >
            <FormattedMessage {...messages.moreLanguages} />
          </DialogTitle>
          <DialogContent aria-label="more-languages-dialog-content">
            <div className="Settings__Language__MoreLang__Dialog">
              <ReactMarkdown source={this.state.markdown} escapeHtml={false} />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleMoreLangClose.bind(this)}
              color="primary"
            >
              <FormattedMessage {...messages.close} />
            </Button>
          </DialogActions>
        </Dialog>
      </FullScreenDialog>
    );
  }
}

const mapStateToProps = state => ({
  language: state.language
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Language);
