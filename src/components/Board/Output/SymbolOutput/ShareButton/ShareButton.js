import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
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

export class ShareButton extends Component {
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

    const shareIconStyle =
      theme.direction === 'ltr' ? null : { transform: 'scaleX(-1)' };

    return (
      <Scannable disabled={hidden}>
        <IconButton aria-label="share" className={classes.button} {...other}>
          <ShareIcon className={classes.icon} style={shareIconStyle} />
        </IconButton>
      </Scannable>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ShareButton);
