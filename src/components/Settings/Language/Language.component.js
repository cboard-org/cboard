import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ISO6391 from 'iso-639-1';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import CheckIcon from '@material-ui/icons/Check';

import FullScreenDialog from '../../UI/FullScreenDialog';
import messages from './Language.messages';

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
  const langItems = langs.map((lang, index, array) => {
    const locale = lang.slice(0, 2).toLowerCase();
    const showLangCode =
      langs.filter(langCode => langCode.slice(0, 2).toLowerCase() === locale)
        .length > 1;

    const langCode = showLangCode ? `(${lang})` : '';

    return (
      <ListItem
        button
        divider={index !== array.length - 1}
        onClick={() => onLangClick(lang)}
        key={index}
      >
        <ListItemText
          primary={
            locale !== 'me'
              ? `${ISO6391.getNativeName(locale)} ${langCode}`
              : `crnogorski jezik ${langCode}`
          }
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
    </FullScreenDialog>
  );
};

Language.propTypes = propTypes;
Language.defaultProps = defaultProps;

export default Language;
