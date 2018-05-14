import React from 'react';
import MUIRadio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const Radio = props => <FormControlLabel control={<MUIRadio />} {...props} />;

export default Radio;
