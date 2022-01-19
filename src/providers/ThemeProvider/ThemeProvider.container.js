import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';

import RTLSupport from './RTLSupport';

import { FONTS_FAMILIES_PROPS } from './ThemeProvider.constants';

export class ThemeProvider extends Component {
  render() {
    const { dir, children, darkThemeActive } = this.props;

    const fontFamily = {
      fontFamily: FONTS_FAMILIES_PROPS.roboto.join(',')
    };

    // This is to change fontFamily on all the htmlDocument.
    // This is to change every textNode that is not contaied on a Typhografy Material UI.
    //Considere put all textNodes in a Typhografy Material Ui Component.
    const rootElement = document.querySelector(':root');
    rootElement.style.fontFamily = fontFamily.fontFamily;

    const lightTheme = createTheme({
      typography: fontFamily,
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
      typography: fontFamily,
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
  darkThemeActive: state.app.displaySettings.darkThemeActive
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThemeProvider);
