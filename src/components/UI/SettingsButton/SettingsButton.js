import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import SettingsIcon from '@material-ui/icons/Settings';

import IconButton from '../IconButton';
import messages from './SettingsButton.messages';

const propTypes = {
  /**
   * The component used for the root node. Either a string to use a DOM element or a component.
   */
  component: PropTypes.object,
  /**
   * If true, back button is disabled
   */
  disabled: PropTypes.bool,
  /**
   * @ignore
   */
  intl: intlShape.isRequired,
  /**
   * Callback fired when back button is clicked
   */
  onClick: PropTypes.func
};

function SettingsButton(props) {
  const { intl, ...other } = props;
  const label = intl.formatMessage(messages.settings);

  return (
    <IconButton label={label} {...other}>
      <SettingsIcon />
    </IconButton>
  );
}

SettingsButton.propTypes = propTypes;

export default injectIntl(SettingsButton);
