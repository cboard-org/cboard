import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

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

export class ClearButton extends Component {
  static propTypes = {
    /**
     * @ignore
     */
    classes: PropTypes.object
  };

  render() {
    const { classes, ...other } = this.props;

    return (
      <IconButton aria-label="Clear" className={classes.button} {...other}>
        <ClearIcon className={classes.icon} />
      </IconButton>
    );
  }
}

export default withStyles(styles)(ClearButton);
