import React from 'react';
import { mount } from 'enzyme';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';

import TonalChip from './TonalChip';

const render = (props = {}, theme = createTheme()) =>
  mount(
    <MuiThemeProvider theme={theme}>
      <TonalChip label="Root" {...props} />
    </MuiThemeProvider>
  );

const cssFor = (element) => {
  const names = element.className.split(' ');
  return Array.from(document.styleSheets)
    .reduce(
      (rules, sheet) => rules.concat(Array.from(sheet.cssRules || [])),
      []
    )
    .filter(
      (rule) =>
        rule.selectorText &&
        names.some((name) => rule.selectorText === `.${name}.${name}`)
    )
    .map((rule) => ({
      // cssstyle only exposes a subset of properties as getters; go through
      // getPropertyValue so shorthands like background-color come back.
      background: rule.style.getPropertyValue('background-color'),
      border: rule.style.getPropertyValue('border-color'),
      color: rule.style.getPropertyValue('color')
    }));
};

describe('TonalChip', () => {
  it('renders its label and icon', () => {
    const wrapper = render({ icon: <HomeIcon /> });
    expect(wrapper.text()).toContain('Root');
    expect(wrapper.find(HomeIcon)).toHaveLength(1);
  });

  it('names itself after the full phrase when the label is abbreviated', () => {
    const chip = render({ label: 'Root', title: 'Root Board' })
      .find('.MuiChip-root')
      .first();
    expect(chip.prop('aria-label')).toBe('Root Board');
  });

  it('tints the chip with the tone, at a specificity MUI cannot override', () => {
    const chip = render({ tone: 'success' }).find('.MuiChip-root').first();
    const declarations = cssFor(chip.getDOMNode());
    const tinted = declarations.filter((style) => style.background);
    expect(tinted).not.toHaveLength(0);
    tinted.forEach((style) => {
      expect(style.background).not.toBe('transparent');
      expect(style.border).toBeTruthy();
    });
  });

  it('tints the error tone with the theme error hue', () => {
    const theme = createTheme();
    const chip = render({ tone: 'error' }, theme).find('.MuiChip-root').first();
    const colors = cssFor(chip.getDOMNode())
      .map((style) => style.color)
      .filter(Boolean);
    expect(colors).toContain(theme.palette.error.dark);
  });

  it('adapts the label shade to a dark theme', () => {
    const shadeFor = (theme) =>
      cssFor(
        render({ tone: 'success' }, theme)
          .find('.MuiChip-root')
          .first()
          .getDOMNode()
      )
        .map((style) => style.color)
        .filter(Boolean);

    const light = shadeFor(createTheme());
    const dark = shadeFor(createTheme({ palette: { type: 'dark' } }));
    expect(light).not.toEqual([]);
    expect(dark).not.toEqual(light);
  });
});
