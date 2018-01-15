import React from 'react';
import MUITextField from 'material-ui/TextField';
import { FormControl, FormHelperText } from 'material-ui/Form';

const TextField = ({ className, error, ...props }) => (
  <FormControl className={className} error={!!error}>
    <MUITextField error={!!error} {...props} />
    {error && <FormHelperText>{error}</FormHelperText>}
  </FormControl>
);

export default TextField;
