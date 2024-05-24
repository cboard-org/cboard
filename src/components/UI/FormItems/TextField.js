import React from 'react';
import PropTypes from 'prop-types';
import MUITextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';

const propTypes = {
  className: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number
  ]),
  endAdornment: PropTypes.node
};

const defaultProps = {
  className: '',
  error: false,
  endAdornment: null
};

const TextField = ({ className, error, endAdornment, ...props }) => (
  <FormControl className={className} error={!!error}>
    <MUITextField
      error={!!error}
      {...props}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">{endAdornment}</InputAdornment>
        ),
        ...props.InputProps
      }}
    />
    {error && <FormHelperText>{error}</FormHelperText>}
  </FormControl>
);

TextField.propTypes = propTypes;
TextField.defaultProps = defaultProps;

export default TextField;
