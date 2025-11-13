import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import messages from './FormItems.messages';

const propTypes = {
  /** Label for the password field */
  label: PropTypes.string.isRequired,
  /** Error message to display */
  error: PropTypes.string,
  /** Name of the password field */
  name: PropTypes.string.isRequired,
  /** Function to handle change in password field */
  onChange: PropTypes.func.isRequired,
  /** Internationalization object */
  /** @ignore */
  intl: intlShape.isRequired
};

const PasswordTextField = ({ label, error, name, onChange, intl }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <TextField
      error={!!error}
      helperText={error}
      aria-label={label}
      label={label}
      type={isPasswordVisible ? 'text' : 'password'}
      name={name}
      onChange={onChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={intl.formatMessage(messages.togglePasswordVisibility)}
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
};

PasswordTextField.propTypes = propTypes;

export default injectIntl(PasswordTextField);
