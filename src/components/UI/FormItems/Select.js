import React from 'react';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MUISelect from '@material-ui/core/Select';

const propTypes = {
  className: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number
  ]),
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired
};

const defaultProps = {
  className: '',
  error: false,
  label: ''
};

const Select = ({ className, error, label, options, ...props }) => (
  <FormControl className={className} error={!!error}>
    {label && <InputLabel>{label}</InputLabel>}
    <MUISelect {...props}>
      {options.map(opt => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </MUISelect>
    {error && <FormHelperText>{error}</FormHelperText>}
  </FormControl>
);

Select.propTypes = propTypes;
Select.defaultProps = defaultProps;

export default Select;
