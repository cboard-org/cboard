import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import ISO6391 from 'iso-639-1';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import CheckIcon from '@material-ui/icons/Check';
import WarningIcon from '@material-ui/icons/Warning';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactMarkdown from 'react-markdown';
import Chip from '@material-ui/core/Chip';

import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Language.messages';
import { isAndroid, isCordova } from '../../../cordova-util';

import './../Settings.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Language extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
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
    language: PropTypes.object.isRequired,
    /**
     * TTS engines list
     */
    ttsEngines: PropTypes.arrayOf(PropTypes.object),
    /**
     * TTS default engine
     */
    ttsEngine: PropTypes.object,
    onSetTtsEngine: PropTypes.func.isRequired
  };

  static defaultProps = {
    langs: [],
    localLangs: [],
    selectedLang: ''
  };

  constructor(props) {
    super(props);

    this.state = {
      moreLangDialog: false,
      loading: false,
      ttsEngine: props.ttsEngine.name,
      openTtsEngineError: false,
      markdown: ''
    };
  }

  componentDidMount() {
    let markdownPath = '';
    try {
      markdownPath = require(`../../../translations/moreLanguages/${
        this.props.language.lang
      }.md`);
    } catch (err) {
      markdownPath = require(`../../../translations/moreLanguages/en-US.md`);
    } finally {
      if (isCordova()) {
        const req = new XMLHttpRequest();
        req.onload = () => {
          const text = req.responseText;
          const utext = this.formatTextForCordova(text);
          this.setState({ markdown: utext });
        };
        req.open('GET', markdownPath);
        req.send();
      } else {
        fetch(markdownPath)
          .then(response => {
            return response.text();
          })
          .then(text => {
            this.setState({ markdown: text });
          });
      }
    }
  }

  formatTextForCordova(text) {
    //remove table of content
    const searchTerm = '##';
    const indexOfFirst = text.indexOf(searchTerm);
    const tableOfContents = text.substring(
      indexOfFirst,
      text.indexOf(searchTerm, indexOfFirst + 1)
    );
    const textNoTableOfContents = text.replace(tableOfContents, '');
    //update path for images
    const searchRegExp = /\/images/gi;
    const replaceWith = './images';
    return textNoTableOfContents.replace(searchRegExp, replaceWith);
  }

  componentDidUpdate(prevProps) {
    if (this.props.ttsEngine.name !== prevProps.ttsEngine.name) {
      this.setState({
        ttsEngine: this.props.ttsEngine.name,
        loading: false
      });
    }
  }

  async handleTtsEngineChange(event) {
    const { onSetTtsEngine } = this.props;
    this.setState({
      ttsEngine: event.target.value,
      loading: true
    });
    try {
      await onSetTtsEngine(event.target.value);
    } catch (err) {
      this.setState({
        ttsEngine: this.props.ttsEngine.name,
        loading: false,
        openTtsEngineError: true
      });
    }
  }

  handleMoreLangClick() {
    this.setState({ moreLangDialog: true });
  }

  handleMoreLangClose() {
    this.setState({ moreLangDialog: false });
  }

  async handleTtsErrorDialogClose() {
    const { onSetTtsEngine } = this.props;
    this.setState({ openTtsEngineError: false });
    onSetTtsEngine(this.props.ttsEngine.name);
  }

  render() {
    const {
      langs,
      localLangs,
      intl,
      ttsEngines,
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
      } else if (lang === 'pt-TL') {
        nativeName = `Tetum`;
      }

      return (
        <ListItem
          id="language-list-item"
          button
          divider={index !== array.length - 1}
          onClick={() => onLangClick(lang)}
          key={index}
        >
          <div className="Language__LangMenuItemText">
            <ListItemText
              primary={nativeName}
              secondary={<FormattedMessage {...messages[locale]} />}
            />
            {!localLangs.includes(lang) && (
              <Chip label="online" size="small" color="secondary" />
            )}
          </div>
          {selectedLang === lang && (
            <CheckIcon className="Language__LangMenuItemCheck" />
          )}
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
          {isAndroid() && (
            <React.Fragment>
              <div className="Settings__Language__TTSEnginesContainer">
                <FormControl
                  className="Settings__Language__TTSEnginesContainer__Select"
                  variant="standard"
                  error={this.state.ttsEngineError}
                  disabled={this.state.loading}
                >
                  <InputLabel id="tts-engines-select-label">
                    <FormattedMessage {...messages.ttsEngines} />
                  </InputLabel>
                  <Select
                    labelId="tts-engines-select-label"
                    id="tts-engines-select"
                    autoWidth={false}
                    value={this.state.ttsEngine}
                    onChange={this.handleTtsEngineChange.bind(this)}
                    inputProps={{
                      name: 'tts-engine',
                      id: 'language-tts-engine'
                    }}
                  >
                    {ttsEngines.map((ttsEng, i) => (
                      <MenuItem key={i} value={ttsEng.name}>
                        {ttsEng.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <Divider variant="middle" />
            </React.Fragment>
          )}
          {this.state.loading ? (
            <CircularProgress
              size={60}
              className="Settings__Language__Spinner"
              thickness={5}
            />
          ) : (
            <List>{langItems}</List>
          )}
          <Dialog
            onClose={this.handleTtsErrorDialogClose.bind(this)}
            aria-labelledby="tts-error-dialog"
            open={this.state.openTtsEngineError}
            className="CommunicatorDialog__boardInfoDialog"
          >
            <DialogTitle
              id="tts-error-dialog-title"
              onClose={this.handleTtsErrorDialogClose.bind(this)}
            >
              <WarningIcon />
              {intl.formatMessage(messages.ttsEngines)}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {intl.formatMessage(messages.ttsEngineError)}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleTtsErrorDialogClose.bind(this)}
                color="primary"
              >
                {intl.formatMessage(messages.close)}
              </Button>
            </DialogActions>
          </Dialog>
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
)(injectIntl(Language));
