import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import LayersIcon from '@material-ui/icons/Layers';
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
      isLoggedIn,
      currentCommunicator,
      openCommunicatorDialog
    } = this.props;

    return (
      <div className={classNames('CommunicatorToolbar', className)}>
        {isLoggedIn && (
          <Button
            className={classNames('Communicator__title', {
              'logged-in': isLoggedIn
            })}
            onClick={this.handleCommunicatorTitleClick}
          >
            {currentCommunicator.name || currentCommunicator.id}
          </Button>
        )}
        {!isLoggedIn && (
          <span className="Communicator__title">
            {currentCommunicator.name || currentCommunicator.id}
          </span>
        )}
        <div className="CommunicatorToolbar__group CommunicatorToolbar__group--start">
          <IconButton
            label={intl.formatMessage(messages.communicators)}
            disabled={isSelecting}
            onClick={openCommunicatorDialog}
          >
            <LayersIcon />
          </IconButton>
        </div>

        <div className="CommunicatorToolbar__group CommunicatorToolbar__group--end">
          <Button
            id="boards-button"
            disabled={isSelecting || boards.length === 0}
            onClick={this.openMenu.bind(this)}
          >
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
                key={board.id}
                onClick={this.switchBoard.bind(this, board)}
              >
                {intl.formatMessage({
                  id: board.nameKey || board.name || board.id
                })}
              </MenuItem>
            ))}
          </Menu>
        </div>

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
