import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ShareIcon from '@material-ui/icons/Share';
import LayersIcon from '@material-ui/icons/Layers';
import IconButton from '../../UI/IconButton';
import messages from './CommunicatorToolbar.messages';

import './CommunicatorToolbar.css';

class CommunicatorToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      boardsMenu: null
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
  }

  render() {
    const {
      intl,
      className,
      boards,
      isSelecting,
      switchBoard,
      onShareClick,
      onCommunicatorsClick
    } = this.props;

    return (
      <div className={classNames('CommunicatorToolbar', className)}>
        <div className="CommunicatorToolbar__group CommunicatorToolbar__group--start">
          <IconButton
            label={intl.formatMessage(messages.communicators)}
            disabled={isSelecting}
            onClick={onCommunicatorsClick}
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

          <IconButton
            label={intl.formatMessage(messages.share)}
            disabled={isSelecting}
            onClick={onShareClick}
          >
            <ShareIcon />
          </IconButton>
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
  onShareClick: () => {},
  onCommunicatorsClick: () => {}
};

CommunicatorToolbar.propTypes = {
  className: PropTypes.string,
  intl: intlShape.isRequired,
  boards: PropTypes.array,
  isSelecting: PropTypes.bool,
  switchBoard: PropTypes.func,
  onShareClick: PropTypes.func,
  onCommunicatorsClick: PropTypes.func
};

export default injectIntl(CommunicatorToolbar);
