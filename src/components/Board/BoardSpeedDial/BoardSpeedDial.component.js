
import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import AddPictogramIcon from '@material-ui/icons/AddPhotoAlternate';
import AddBoardIcon from '@material-ui/icons/AddToPhotos';

import messages from './BoardSpeedDial.messages';
import './BoardSpeedDial.css';

const styles = theme => ({
  root: {
    height: 38
  },
  speedDial: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 4
  }
});

export class BoardSpeedDial extends Component {

  static propTypes = {
    /**
     * @ignore
     */
    className: PropTypes.string,
    /**
     * @ignore
     */
    classes: PropTypes.object,
    /**
     * @ignore
     */
    intl: intlShape.isRequired,
    /**
     * If true, select all checkbox will be checked
     */
    isSelectAll: PropTypes.bool
  }

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      hidden: false
    };

    this.actions = this.getActions();
  }

  getActions = () => {
    const { intl } = this.props;
    return [
      {
        icon: <AddBoardIcon />,
        name: intl.formatMessage(messages.addNewBoard),
        option: 'board',
        delay: 1
      },
      {
        icon: <AddPictogramIcon />,
        name: intl.formatMessage(messages.addNewPictogram),
        option: 'pictogram',
        delay: 2
      }
    ];
  };

  handleVisibility = () => {
    this.setState(state => ({
      open: false,
      hidden: !state.hidden
    }));
  };

  handleClick = () => {
    this.setState(state => ({
      open: !state.open
    }));
  };

  handleOpen = () => {
    if (!this.state.hidden) {
      this.setState({
        open: true
      });
    }
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    const { onAddClick, classes } = this.props;
    const { hidden, open } = this.state;

    return (
      <div className={classes.root}>
          <SpeedDial
            ariaLabel="SpeedDial tooltip example"
            className={classes.speedDial}
            hidden={hidden}
            icon={<SpeedDialIcon />}
            onBlur={this.handleClose}
            onClick={this.handleClick}
            onClose={this.handleClose}
            onFocus={this.handleOpen}
            onMouseEnter={this.handleOpen}
            onMouseLeave={this.handleClose}
            open={open}
          >
            {this.actions.map(action => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                tooltipOpen
                onClick={onAddClick}
                delay={action.delay}
              />
            ))}
          </SpeedDial>
        </div>
    );
  }
}

export default compose(withStyles(styles))(injectIntl(BoardSpeedDial));
