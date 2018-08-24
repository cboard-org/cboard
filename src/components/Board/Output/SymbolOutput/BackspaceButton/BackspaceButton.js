import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import { Scannable } from 'react-scannable';

const styles = {
  button: {
    alignSelf: 'center',
    height: '64px',
    width: '64px'
  },
  icon: {
    height: '32px',
    width: '32px'
  }
};

export class BackspaceButton extends Component {
  static propTypes = {
    /**
     * @ignore
     */
    classes: PropTypes.object
  };

  render() {
    const { classes, theme, ...other } = this.props;

    const backspaceIconStyle =
      theme.direction === 'ltr' ? null : { transform: 'scaleX(-1)' };

    return (
      <Scannable>
        <IconButton
          aria-label="Backspace"
          className={classes.button}
          {...other}
        >
          <BackspaceIcon className={classes.icon} style={backspaceIconStyle} />
        </IconButton>
      </Scannable>
    );
  }
}

export default withStyles(styles, { withTheme: true })(BackspaceButton);
