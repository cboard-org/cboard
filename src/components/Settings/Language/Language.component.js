import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ISO6391 from 'iso-639-1';
import List, { ListItem, ListItemText } from 'material-ui/List';
import CheckIcon from 'material-ui-icons/Check';

import FullScreenDialog from '../../FullScreenDialog';
import messages from './Language.messages';

const propTypes = {
  /**
   * Languages to display
   */
  langs: PropTypes.arrayOf(PropTypes.string),
  /**
   * If true, Language will be visible
   */
  open: PropTypes.bool.isRequired,
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
  onRequestClose: PropTypes.func.isRequired,
  /**
   * Callback fired when submitting selected language
   */
  onSubmitLang: PropTypes.func.isRequired
};

const Language = ({
  langs,
  open,
  selectedLang,
  onLangClick,
  onRequestClose,
  onSubmitLang
}) => {
  const langItems = langs.map((lang, index, array) => {
    const locale = lang.slice(0, 2).toLowerCase();

    return (
      <ListItem
        button
        divider={index !== array.length - 1}
        onClick={() => onLangClick(lang)}
        key={index}
        disableRipple
      >
        <ListItemText
          primary={`${ISO6391.getNativeName(locale)} (${lang})`}
          secondary={<FormattedMessage {...messages[locale]} />}
        />
        {selectedLang === lang && <CheckIcon />}
      </ListItem>
    );
  });
  return (
    <FullScreenDialog
      open={open}
      title={<FormattedMessage {...messages.language} />}
      onRequestClose={onRequestClose}
      onSubmit={onSubmitLang}
    >
      <List>{langItems}</List>
    </FullScreenDialog>
  );
};

Language.propTypes = propTypes;

export default Language;
