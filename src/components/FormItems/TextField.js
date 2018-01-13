import React from 'react';
import MUITextField from 'material-ui/TextField';
import { FormControl, FormHelperText } from 'material-ui/Form';

const TextField = ({ error, ...props }) => (
  <FormControl className="SignUp__field" error={!!error}>
    <MUITextField error={!!error} {...props} />
    {error && <FormHelperText>{error}</FormHelperText>}
  </FormControl>
);

export default TextField;
