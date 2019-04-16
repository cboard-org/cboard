import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import { Button } from '@material-ui/core';
import messages from './UndoButton.messages';

const propTypes = {
  /**
   * @ignore
   */
  intl: intlShape.isRequired,
  /**
   * Callback fired when back button is clicked
   */
  onClick: PropTypes.func.isRequired
};

function UndoButton(props) {
  const { intl, onClick, ...other } = props;

  return (
    <Button
      key="undo"
      color="secondary"
      size="medium"
      onClick={onClick}
      {...other}
    >
      {intl.formatMessage(messages.undo)}
    </Button>
  );
}

UndoButton.propTypes = propTypes;

export default injectIntl(UndoButton);
