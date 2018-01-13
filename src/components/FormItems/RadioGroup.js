import React from 'react';
import { RadioGroup as MUIRadioGroup } from 'material-ui/Radio';
import { FormControl, FormLabel } from 'material-ui/Form';

const RadioGroup = ({ children, className, label, error, ...rest }) => (
  <FormControl className={className} error={!!error}>
    <FormLabel>{label}</FormLabel>
    <MUIRadioGroup {...rest}>{children}</MUIRadioGroup>
  </FormControl>
);

export default RadioGroup;
