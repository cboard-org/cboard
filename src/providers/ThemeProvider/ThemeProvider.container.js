import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';

import RTLSupport from './RTLSupport';

import { FONTS_FAMILIES, DEFAULT_FONT_FAMILY } from './ThemeProvider.constants';

const setRootFontFamily = fontFamily => {
  // This is to change fontFamily on all the htmlDocument.
  // This is to change every textNode that is not contaied in a Typhografy Material UI component.
  //Considere put all text in a Typhografy.
  const rootElement = document.querySelector(':root');
  rootElement.style.fontFamily = fontFamily;
};
export class ThemeProvider extends Component {
  static defaultProps = {
    fontFamilyName: DEFAULT_FONT_FAMILY
  };

  render() {
    const { dir, children, darkThemeActive, fontFamilyName } = this.props;

    const fontFamily = FONTS_FAMILIES.filter(
      font => font.fontName === fontFamilyName
    )[0].fontFamily;

    setRootFontFamily(fontFamily);

    const lightTheme = createTheme({
      typography: { fontFamily },
      direction: dir
    });

    const darkTheme = createTheme({
      palette: {
        type: 'dark',
        primary: {
          main: '#78909c'
        },
        secondary: amber
      },
      typography: { fontFamily },
      direction: dir
    });

    return (
      <MuiThemeProvider theme={darkThemeActive ? darkTheme : lightTheme}>
        <RTLSupport>{children}</RTLSupport>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  dir: state.language.dir,
  darkThemeActive: state.app.displaySettings.darkThemeActive,
  fontFamilyName: state.app.displaySettings.fontFamily
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThemeProvider);
