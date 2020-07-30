import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import HelpIcon from '@material-ui/icons/Help';

import IconButton from '../IconButton';
import messages from '../../Settings/Settings.messages';

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

function HelpButton(props) {
  const { intl, ...other } = props;
  const label = intl.formatMessage(messages.userHelp);

  return (
    <IconButton id="help-button" label={label} {...other}>
      <HelpIcon />
    </IconButton>
  );
}

HelpButton.propTypes = propTypes;

export default injectIntl(HelpButton);
