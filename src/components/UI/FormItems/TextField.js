import React from 'react';
import PropTypes from 'prop-types';
import MUITextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

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
