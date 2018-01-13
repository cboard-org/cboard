import React from 'react';
import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import MUISelect from 'material-ui/Select';

const Select = ({ error, label, options, ...props }) => (
  <FormControl className="SignUp__field" error={!!error}>
    <InputLabel>{label}</InputLabel>
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

export default Select;
