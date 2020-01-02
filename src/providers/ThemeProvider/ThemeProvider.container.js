import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import RTLSupport from './RTLSupport';

export class ThemeProvider extends Component {
  render() {
    const { dir, children } = this.props;

    const theme = createMuiTheme({
      typography: {},
      direction: dir
    });

    return (
      <MuiThemeProvider theme={theme}>
        <RTLSupport>{children}</RTLSupport>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  dir: state.language.dir
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThemeProvider);
