import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import messages from './FormItems.messages';

const propTypes = {
  /** Label for the API key field */
  label: PropTypes.string,
  /** Error state */
  error: PropTypes.bool,
  /** Helper text to display */
  helperText: PropTypes.string,
  /** Name of the field */
  name: PropTypes.string.isRequired,
  /** Value of the field */
  value: PropTypes.string,
  /** Placeholder text */
  placeholder: PropTypes.string,
  /** Function to handle change */
  onChange: PropTypes.func.isRequired,
  /** Internationalization object */
  /** @ignore */
  intl: intlShape.isRequired
};

const ApiKeyTextField = ({
  label,
  error,
  helperText,
  name,
  value,
  placeholder,
  onChange,
  intl
}) => {
  const [isVisible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!isVisible);
  };

  return (
    <TextField
      error={error}
      helperText={helperText}
      aria-label={label || name}
      label={label}
      type={isVisible ? 'text' : 'password'}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      autoComplete="new-password"
      inputProps={{
        autoComplete: 'new-password',
        'data-lpignore': 'true',
        'data-form-type': 'other'
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={intl.formatMessage(messages.togglePasswordVisibility)}
              onClick={toggleVisibility}
              edge="end"
            >
              {isVisible ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        )
      }}
      fullWidth
    />
  );
};

ApiKeyTextField.propTypes = propTypes;

export default injectIntl(ApiKeyTextField);
