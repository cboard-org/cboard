import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import LayersIcon from '@material-ui/icons/Layers';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ViewModuleIcon from '@material-ui/icons/ViewModule';

import IconButton from '../../UI/IconButton';
import FormDialog from '../../UI/FormDialog';
import messages from './CommunicatorToolbar.messages';
import './CommunicatorToolbar.css';

class CommunicatorToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      boardsMenu: null,
      openTitleDialog: false,
      titleDialogValue:
        this.props.currentCommunicator.name ||
        this.props.currentCommunicator.id ||
        ''
    };
  }

  openMenu(e) {
    this.setState({ boardsMenu: e.currentTarget });
  }

  closeMenu() {
    this.setState({ boardsMenu: null });
  }

  switchBoard(board) {
    this.closeMenu();
    this.props.switchBoard(board.id);
    this.props.history.replace(`/board/${board.id}`);
  }

  handleCommunicatorTitleClick = () => {
    if (!this.props.isLoggedIn) {
      return false;
    }

    if (!this.isCommunicatorTitleClicked) {
      this.isCommunicatorTitleClicked = setTimeout(() => {
        this.isCommunicatorTitleClicked = false;
      }, 400);
    } else {
      this.setState({
        openTitleDialog: true,
        titleDialogValue:
          this.props.currentCommunicator.name ||
          this.props.currentCommunicator.id ||
          ''
      });
    }
  };

  handleCommunicatorTitleChange = event => {
    const { value: titleDialogValue } = event.target;
    this.setState({ titleDialogValue });
  };

  handleCommunicatorTitleSubmit = async () => {
    if (this.state.titleDialogValue.length) {
      try {
        await this.props.editCommunicatorTitle(this.state.titleDialogValue);
      } catch (e) {}
    }
    this.handleCommunicatorTitleClose();
  };

  handleCommunicatorTitleClose = () => {
    this.setState({
      openTitleDialog: false,
      titleDialogValue:
        this.props.currentCommunicator.name ||
        this.props.currentCommunicator.id ||
        ''
    });
  };

  render() {
    const {
      intl,
      className,
      boards,
      isSelecting,
      openCommunicatorDialog
    } = this.props;

    return (
      <div className={classNames('CommunicatorToolbar', className)}>

        <Button
          className="Communicator__title"
          id="boards-button"
          disabled={isSelecting || boards.length === 0}
          onClick={this.openMenu.bind(this)}
        >
          <ArrowDropDownIcon />
          <FormattedMessage {...messages.boards} />
        </Button>
        <Menu
          id="boards-menu"
          className="CommunicatorToolbar__menu"
          anchorEl={this.state.boardsMenu}
          open={Boolean(this.state.boardsMenu)}
          onClose={this.closeMenu.bind(this)}
        >
          {boards.map(board => (
            <MenuItem
              className="CommunicatorToolbar__menuitem"
              key={board.id}
              onClick={this.switchBoard.bind(this, board)}
            >
              <ListItem>
                <ListItemAvatar>
                  {board.caption
                    ? <Avatar src={board.caption} />
                    : <Avatar>
                        <ViewModuleIcon />
                    </Avatar>
                  }
                </ListItemAvatar>
                <ListItemText
                  inset
                  primary={board.name || board.id}
                  secondary={board.tiles.length + ' ' + intl.formatMessage(messages.tiles) }
                  />
              </ListItem>
            </MenuItem>
          ))}
          </Menu>
        <FormDialog
          open={this.state.openTitleDialog}
          title={<FormattedMessage {...messages.editTitle} />}
          onSubmit={this.handleCommunicatorTitleSubmit}
          onClose={this.handleCommunicatorTitleClose}
        >
          <TextField
            autoFocus
            margin="dense"
            label={<FormattedMessage {...messages.communicatorTitle} />}
            value={this.state.titleDialogValue}
            type="text"
            onChange={this.handleCommunicatorTitleChange}
            fullWidth
            required
          />
        </FormDialog>

        <div className="CommunicatorToolbar__group CommunicatorToolbar__group--start">
          <IconButton
            label={intl.formatMessage(messages.communicators)}
            disabled={isSelecting}
            onClick={openCommunicatorDialog}
          >
            <LayersIcon />
          </IconButton>
            <Typography
             variant='button'
             color='inherit'
             disabled={isSelecting}
            >{intl.formatMessage(messages.editCommunicator)}
            </Typography>
        </div>

        <div className="CommunicatorToolbar__group CommunicatorToolbar__group--end" />

      </div>
    );
  }
}

CommunicatorToolbar.defaultProps = {
  className: '',
  boards: [],
  isSelecting: false,
  switchBoard: () => {},
  showNotification: () => {},
  openCommunicatorDialog: () => {}
};

CommunicatorToolbar.propTypes = {
  className: PropTypes.string,
  intl: intlShape.isRequired,
  boards: PropTypes.array,
  currentCommunicator: PropTypes.object,
  isSelecting: PropTypes.bool,
  showNotification: PropTypes.func,
  switchBoard: PropTypes.func,
  openCommunicatorDialog: PropTypes.func,
  editCommunicatorTitle: PropTypes.func
};

export default CommunicatorToolbar;
