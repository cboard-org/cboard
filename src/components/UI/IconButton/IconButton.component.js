import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'material-ui/Tooltip';
import MUIIconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';

const propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

function IconButton({ label, disabled, onClick }) {
  return (
    <Fragment>
      {disabled ? (
        <MUIIconButton
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
          color="inherit"
          style={{
            color: 'rgba(255, 255, 255, 0.26)'
          }}
        >
          <ArrowBackIcon />
        </MUIIconButton>
      ) : (
        <Tooltip title={label} placement="bottom">
          <MUIIconButton aria-label={label} color="inherit" onClick={onClick}>
            <ArrowBackIcon />
          </MUIIconButton>
        </Tooltip>
      )}
    </Fragment>
  );
}

IconButton.propTypes = propTypes;

export default IconButton;
