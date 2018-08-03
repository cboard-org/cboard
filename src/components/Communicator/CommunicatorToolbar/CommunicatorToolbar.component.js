import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormattedMessage, intlShape } from 'react-intl';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import LayersIcon from '@material-ui/icons/Layers';
import IconButton from '../../UI/IconButton';
import CommunicatorShare from '../CommunicatorShare';
import messages from './CommunicatorToolbar.messages';

import './CommunicatorToolbar.css';

class CommunicatorToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      boardsMenu: null,
      openShareDialog: false
    };
  }

  openMenu(e) {
    this.setState({ boardsMenu: e.currentTarget });
  }

  closeMenu() {
    this.setState({ boardsMenu: null });
  }

  onShareClick() {
    if (window && window.navigator && window.navigator.share) {
      const shareFn = window.navigator.share;
      shareFn({
        title: window.document.title,
        url: window.location.href
      });
    } else {
      this.setState({ openShareDialog: true });
    }
  }

  onShareClose() {
    this.setState({ openShareDialog: false });
  }

  switchBoard(board) {
    this.closeMenu();
    this.props.switchBoard(board.id);
    this.props.history.replace(`/board/${board.id}`);
  }

  copyLinkAction() {
    copy(window.location.href);
    const copyMessage = this.props.intl.formatMessage(messages.copyMessage);

    this.props.showNotification(copyMessage);
  }

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
        <div className="CommunicatorToolbar__group CommunicatorToolbar__group--start">
          <IconButton
            label={intl.formatMessage(messages.communicators)}
            disabled={isSelecting}
            onClick={openCommunicatorDialog}
          >
            <LayersIcon />
          </IconButton>
        </div>

        <div className="CommunicatorToolbar__group CommunicatorToolbar__group--middle" />

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

          <CommunicatorShare
            label={intl.formatMessage(messages.share)}
            disabled={isSelecting}
            onShareClick={this.onShareClick.bind(this)}
            onShareClose={this.onShareClose.bind(this)}
            copyLinkAction={this.copyLinkAction.bind(this)}
            open={this.state.openShareDialog}
            url={window.location.href}
          />
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
  isSelecting: PropTypes.bool,
  showNotification: PropTypes.func,
  switchBoard: PropTypes.func,
  openCommunicatorDialog: PropTypes.func
};

export default withRouter(CommunicatorToolbar);
