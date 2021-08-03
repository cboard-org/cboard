import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import IconButton from '../IconButton';
import messages from './BackButton.messages';

const propTypes = {
  /**
   * If true, back button is disabled
   */
  disabled: PropTypes.bool,
  /**
   * @ignore
   */
  intl: intlShape.isRequired,
  /**
   * @ignore
   */
  theme: PropTypes.object.isRequired,
  /**
   * Callback fired when back button is clicked
   */
  onClick: PropTypes.func.isRequired
};

function BackButton(props) {
  const { intl, theme, ...rest } = props;
  const label = intl.formatMessage(messages.back);

  return (
    <IconButton id="back-button" label={label} {...rest}>
      {theme.direction === 'ltr' ? <ArrowBackIcon /> : <ArrowForwardIcon />}
    </IconButton>
  );
}

BackButton.propTypes = propTypes;

export default withStyles(null, { withTheme: true })(injectIntl(BackButton));
