import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ISO6391 from 'iso-639-1';
import List, { ListItem, ListItemText } from 'material-ui/List';
import CheckIcon from 'material-ui-icons/Check';

import FullScreenDialog from '../../FullScreenDialog';
import messages from './Language.messages';

const propTypes = {
  locales: PropTypes.array,
  open: PropTypes.bool,
  selectedLocale: PropTypes.string.isRequired,
  onLocaleClick: PropTypes.func,
  onRequestClose: PropTypes.func,
  onSubmitLocale: PropTypes.func
};

const Language = ({
  locales,
  open,
  selectedLocale,
  onLocaleClick,
  onRequestClose,
  onSubmitLocale
}) => {
  const localeItems = locales.map((locale, index, array) => {
    return (
      <ListItem
        button
        divider={index === array.length - 1 ? false : true}
        onClick={() => onLocaleClick(locale)}
        key={index}
        disableRipple
      >
        <ListItemText
          primary={ISO6391.getNativeName(locale)}
          secondary={<FormattedMessage {...messages[locale]} />}
        />
        {selectedLocale === locale && <CheckIcon />}
      </ListItem>
    );
  });
  return (
    <FullScreenDialog
      open={open}
      title={<FormattedMessage {...messages.language} />}
      onRequestClose={onRequestClose}
      onSubmit={onSubmitLocale}
    >
      <List>{localeItems}</List>
    </FullScreenDialog>
  );
};

Language.propTypes = propTypes;

export default Language;
