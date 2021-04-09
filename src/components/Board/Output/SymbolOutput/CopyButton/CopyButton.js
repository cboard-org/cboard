import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FileCopy from '@material-ui/icons/FileCopy';
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

export class CopyButton extends Component {
  static propTypes = {
    /**
     * @ignore
     */
    classes: PropTypes.object,
    /**
     * @ignore
     */
    theme: PropTypes.object,

    hidden: PropTypes.bool
  };

  render() {
    const { classes, theme, hidden, ...other } = this.props;

    const copyIconStyle =
      theme.direction === 'ltr' ? null : { transform: 'scaleX(-1)' };

    return (
      <Scannable disabled={hidden}>
        <IconButton aria-label="Copy" className={classes.button} {...other}>
          <FileCopy className={classes.icon} style={copyIconStyle} />
        </IconButton>
      </Scannable>
    );
  }
}

export default withStyles(styles, { withTheme: true })(CopyButton);
