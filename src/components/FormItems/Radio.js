import React from 'react';
import MUIRadio from 'material-ui/Radio';
import { FormControlLabel } from 'material-ui/Form';

const Radio = props => <FormControlLabel control={<MUIRadio />} {...props} />;

export default Radio;
