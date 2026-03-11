import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TextField from '@material-ui/core/TextField';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  IconButton
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

import messages from './PinDialog.messages';
import './PinDialog.css';

const propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

const defaultProps = {
  error: false,
  value: ''
};

const PinDialog = ({ open, onClose, onSubmit, error, value, onChange }) => {
  const inputRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(
    () => {
      if (open && inputRef.current) {
        setTimeout(() => {
          inputRef.current.focus();
        }, 100);
      }
      if (open) {
        setIsVisible(false);
      }
    },
    [open]
  );

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleKeyPress = event => {
    if (event.key === 'Enter' && value.length === 4) {
      onSubmit();
    }
  };

  const handleChange = event => {
    const newValue = event.target.value.replace(/\D/g, '').slice(0, 4);
    onChange(newValue);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="pin-dialog-title"
      aria-describedby="pin-dialog-description"
    >
      <DialogTitle id="pin-dialog-title">
        <FormattedMessage {...messages.title} />
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="pin-dialog-description">
          <FormattedMessage {...messages.description} />
        </DialogContentText>
        <TextField
          inputRef={inputRef}
          autoFocus
          fullWidth
          type={isVisible ? 'text' : 'password'}
          inputProps={{
            maxLength: 4,
            pattern: '[0-9]*',
            inputMode: 'numeric'
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle pin visibility"
                  onClick={toggleVisibility}
                  edge="end"
                >
                  {isVisible ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
          className="PinDialog__input"
          value={value}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          error={error}
          helperText={
            error ? <FormattedMessage {...messages.incorrectPin} /> : ''
          }
          placeholder="****"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          <FormattedMessage {...messages.cancel} />
        </Button>
        <Button
          onClick={onSubmit}
          color="primary"
          variant="contained"
          disabled={value.length !== 4}
        >
          <FormattedMessage {...messages.unlock} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PinDialog.propTypes = propTypes;
PinDialog.defaultProps = defaultProps;

export default PinDialog;
