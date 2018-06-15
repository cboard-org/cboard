import React from 'react';
import PropTypes from 'prop-types';
import PrintBoardIcon from '@material-ui/icons/Print';

import IconButton from '../IconButton';

const PrintBoardButton = ({ label, disabled, onClick }) => (
  <IconButton label={label} disabled={disabled} onClick={onClick}>
    <PrintBoardIcon />
  </IconButton>
);

PrintBoardButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default PrintBoardButton;
