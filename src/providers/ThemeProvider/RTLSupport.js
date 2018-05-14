import React from 'react';

import { create } from 'jss';
import rtl from 'jss-rtl';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';

// Configure JSS
const jss = create({
  plugins: [...jssPreset().plugins, rtl()]
});

// Custom Material-UI class name generator.
const generateClassName = createGenerateClassName();

export function RTLSupport({ children }) {
  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      {React.Children.only(children)}
    </JssProvider>
  );
}

export default RTLSupport;
