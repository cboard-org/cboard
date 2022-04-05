import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { Scannable } from 'react-scannable';

export class ClearButton extends Component {
  static propTypes = {
    /**
     * @ignore
     */
    classes: PropTypes.object,
    hidden: PropTypes.bool
  };

  render() {
    const { classes, hidden, increaseOutputButtons, ...other } = this.props;

    return (
      <Scannable disabled={hidden}>
        <IconButton
          aria-label="Clear"
          className={
            increaseOutputButtons ? 'Output__button__lg' : 'Output__button__sm'
          }
          {...other}
        >
          <ClearIcon
            className={
              increaseOutputButtons ? 'Output__icon__lg' : 'Output__icon__sm'
            }
          />
        </IconButton>
      </Scannable>
    );
  }
}

export default withStyles(null)(ClearButton);
