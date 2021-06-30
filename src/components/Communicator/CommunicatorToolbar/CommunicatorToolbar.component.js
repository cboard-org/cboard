import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import Menu from '@material-ui/core/Menu';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import LayersIcon from '@material-ui/icons/Layers';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import FormDialog from '../../UI/FormDialog';
import messages from './CommunicatorToolbar.messages';
import './CommunicatorToolbar.css';
import { isCordova } from '../../../cordova-util';

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

  handleNewBoardClick = () => {};

  boardCaption = board => {
    // Cordova path cannot be absolute
    if (isCordova() && board.caption && board.caption.search('/') === 0) {
      return `.${board.caption}`;
    } else {
      return board.caption;
    }
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
            <ListItem
              className="CommunicatorToolbar__menuitem"
              key={board.id}
              onClick={this.switchBoard.bind(this, board)}
            >
              <ListItemAvatar>
                {this.boardCaption(board) ? (
                  <Avatar src={this.boardCaption(board)} />
                ) : (
                  <Avatar>
                    <ViewModuleIcon />
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText
                inset
                primary={
                  board.name ||
                  (board.nameKey &&
                    intl.formatMessage({
                      id: board.nameKey,
                      defaultMessage: board.id
                    }))
                }
                secondary={intl.formatMessage(messages.tiles, {
                  qty: board.tiles.length
                })}
              />
            </ListItem>
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
          <Button
            className={'edit__communicator'}
            disabled={isSelecting}
            onClick={openCommunicatorDialog}
          >
            <LayersIcon className="CommunicatorToolbar__group CommunicatorToolbar__group--start--button" />
            {intl.formatMessage(messages.editCommunicator)}
          </Button>
        </div>
        <div className="CommunicatorToolbar__group CommunicatorToolbar__group--end">
          {false && (
            <div>
              <Button
                label={intl.formatMessage(messages.addBoardButton)}
                onClick={this.handleNewBoardClick}
                //TODO: need to implement function
                disabled={isSelecting}
                color="inherit"
              >
                {intl.formatMessage(messages.addBoardButton)}
                <AddCircleIcon />
              </Button>
            </div>
          )}
        </div>
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
