import React from 'react';
import PropTypes from 'prop-types';
import { RadioGroup as MUIRadioGroup } from 'material-ui/Radio';
import { FormControl, FormLabel } from 'material-ui/Form';

const propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  className: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number
  ]),
  label: PropTypes.string
};

const defaultProps = {
  className: '',
  error: false,
  label: ''
};

const RadioGroup = ({ children, className, error, label, ...rest }) => (
  <FormControl className={className} error={!!error}>
    <FormLabel>{label}</FormLabel>
    <MUIRadioGroup {...rest}>{children}</MUIRadioGroup>
  </FormControl>
);

RadioGroup.propTypes = propTypes;
RadioGroup.defaultProps = defaultProps;

export default RadioGroup;
