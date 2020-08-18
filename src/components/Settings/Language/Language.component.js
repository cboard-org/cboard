import React, { useState } from 'react';
import PropTypes from 'prop-types';
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

import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Language.messages';

import './../Settings.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const propTypes = {
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
  onSubmitLang: PropTypes.func.isRequired
};

const defaultProps = {
  langs: [],
  selectedLang: ''
};

const Language = ({
  langs,
  selectedLang,
  onLangClick,
  onClose,
  onSubmitLang
}) => {
  const [moreLangDialog, setMoreLangDialog] = useState(false);
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

  const handlMoreLangClick = () => {
    setMoreLangDialog(true);
  };
  const handlMoreLangClose = () => {
    setMoreLangDialog(false);
  };
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
        <Button color="primary" onClick={handlMoreLangClick}>
          <FormattedMessage {...messages.moreLanguages} />
        </Button>
      </div>
      <Dialog
        onClose={handlMoreLangClose}
        aria-labelledby="more-languages-dialog"
        open={moreLangDialog}
        TransitionComponent={Transition}
        aria-describedby="more-languages-dialog-desc"
      >
        <DialogTitle
          id="more-languages-dialog-title"
          onClose={handlMoreLangClose}
        >
          <FormattedMessage {...messages.moreLanguages} />
        </DialogTitle>
        <DialogContent />
        <DialogActions>
          <Button onClick={handlMoreLangClose} color="primary">
            <FormattedMessage {...messages.close} />
          </Button>
        </DialogActions>
      </Dialog>
    </FullScreenDialog>
  );
};

Language.propTypes = propTypes;
Language.defaultProps = defaultProps;

export default Language;
