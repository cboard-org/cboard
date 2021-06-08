import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';

import IconButton from '../IconButton';
import messages from '../../Settings/Settings.messages';

const propTypes = {
  /**
   * The component used for the root node. Either a string to use a DOM element or a component.
   */
  component: PropTypes.node,
  /**
   * If true, back button is disabled
   */
  disabled: PropTypes.bool,
  /**
   * @ignore
   */
  intl: intlShape.isRequired,
  /**
   * Callback fired when LiveHelp button is clicked
   */
  onClick: PropTypes.func
};

function LiveHelpButton(props) {
  const { intl, ...other } = props;
  const label = intl.formatMessage(messages.userLiveHelp);

  return (
    <IconButton label={label} {...other}>
      <LiveHelpIcon />
    </IconButton>
  );
}

LiveHelpButton.propTypes = propTypes;

export default injectIntl(LiveHelpButton);
