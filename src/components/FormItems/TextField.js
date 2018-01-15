import React from 'react';
import PropTypes from 'prop-types';
import MUITextField from 'material-ui/TextField';
import { FormControl, FormHelperText } from 'material-ui/Form';

const propTypes = {
  className: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number
  ])
};

const defaultProps = {
  className: '',
  error: false
};

const TextField = ({ className, error, ...props }) => (
  <FormControl className={className} error={!!error}>
    <MUITextField error={!!error} {...props} />
    {error && <FormHelperText>{error}</FormHelperText>}
  </FormControl>
);

TextField.propTypes = propTypes;
TextField.defaultProps = defaultProps;

export default TextField;
