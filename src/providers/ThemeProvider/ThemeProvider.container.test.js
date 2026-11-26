import React from 'react';
import { shallow } from 'enzyme';

import { ThemeProvider } from './ThemeProvider.container';
import { DEFAULT_FONT_FAMILY } from './ThemeProvider.constants';

describe('ThemeProvider', () => {
  it('uses Roboto by default', () => {
    expect(DEFAULT_FONT_FAMILY).toBe('Roboto');
  });

  it('falls back to the default font for an unknown font name', () => {
    const wrapper = shallow(
      <ThemeProvider fontFamilyName="Cboard Helvetica">
        <div />
      </ThemeProvider>
    );
    expect(wrapper.prop('theme').typography.fontFamily).toBe(
      'Roboto,Helvetica,Arial,sans-serif'
    );
    expect(document.documentElement.style.fontFamily).toContain('Roboto');
  });

  it('applies the selected font', () => {
    const wrapper = shallow(
      <ThemeProvider fontFamilyName="Nunito">
        <div />
      </ThemeProvider>
    );
    expect(wrapper.prop('theme').typography.fontFamily).toMatch(/^Nunito,/);
  });
});
