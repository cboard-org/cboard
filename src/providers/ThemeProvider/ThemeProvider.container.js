import React, { Component } from 'react';
import { connect } from 'react-redux';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, jssPreset } from 'material-ui/styles';

export class ThemeProvider extends Component {
  render() {
    const { dir, children } = this.props;

    // Configure JSS
    const jss = create({
      plugins: [...jssPreset().plugins, dir === 'rtl' && rtl()]
    });

    // Custom Material-UI class name generator.
    const generateClassName = createGenerateClassName();

    const theme = createMuiTheme({
      direction: dir
    });

    return (
      <MuiThemeProvider theme={theme}>
        <JssProvider jss={jss} generateClassName={generateClassName}>
          {React.Children.only(children)}
        </JssProvider>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  dir: state.language.dir
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ThemeProvider);
