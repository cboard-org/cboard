import React from 'react';

import { create } from 'jss';
import rtl from 'jss-rtl';
import {
  StylesProvider,
  createGenerateClassName,
  jssPreset
} from '@material-ui/core/styles';

// Configure JSS
const jss = create({
  plugins: [...jssPreset().plugins, rtl()]
});

// Custom Material-UI class name generator.
const generateClassName = createGenerateClassName();

export function RTLSupport({ children }) {
  return (
    <StylesProvider jss={jss} generateClassName={generateClassName}>
      {React.Children.only(children)}
    </StylesProvider>
  );
}

export default RTLSupport;
