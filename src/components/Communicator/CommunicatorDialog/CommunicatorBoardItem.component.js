import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, FormattedMessage } from 'react-intl';
import MenuIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/AddCircle';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import PublicIcon from '@material-ui/icons/Public';
import KeyIcon from '@material-ui/icons/VpnKey';
import BrokenIcon from '@material-ui/icons/BrokenImage';
import IconButton from '../../UI/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { TAB_INDEXES } from './CommunicatorDialog.constants';
import messages from './CommunicatorDialog.messages';

class CommunicatorBoardItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: null,
      board: props.board
    };
  }

  openMenu(e) {
    this.setState({ menu: e.currentTarget });
  }

  closeMenu() {
    this.setState({ menu: null });
  }

  componentWillReceiveProps({ board }) {
    if (board.id !== this.state.board.id) {
      this.setState({ board });
    }
  }

  async publishBoardAction(board) {
    const data = await this.props.publishBoardAction(board);

    this.setState({ board: data, menu: null });
  }

  async setRootBoard(board) {
    await this.props.setRootBoard(board);

    this.setState({ menu: null });
  }

  render() {
    const board = this.state.board;
    const {
      selectedTab,
      intl,
      selectedIds,
      userData,
      communicator,
      addOrRemoveBoard
    } = this.props;
    const title = intl.formatMessage({
      id: board.nameKey || board.name || board.id
    });

    return (
      <div className="CommunicatorDialog__boards__item">
        <div className="CommunicatorDialog__boards__item__image">
          {!!board.caption && <img src={board.caption} alt={title} />}
          {!board.caption && (
            <div className="CommunicatorDialog__boards__item__image__empty">
              <BrokenIcon />
            </div>
          )}
          {(communicator.rootBoard !== board.id || !userData.authToken) && (
            <div className="CommunicatorDialog__boards__item__image__button">
              <IconButton
                label={intl.formatMessage(
                  selectedIds.indexOf(board.id) >= 0
                    ? messages.removeBoard
                    : messages.addBoard
                )}
                onClick={() => {
                  addOrRemoveBoard(board);
                }}
              >
                {selectedIds.indexOf(board.id) >= 0 ? (
                  <RemoveIcon />
                ) : (
                  <AddIcon />
                )}
              </IconButton>
            </div>
          )}
        </div>
        <div className="CommunicatorDialog__boards__item__data">
          <div className="CommunicatorDialog__boards__item__data__button">
            <IconButton
              className={`board-item-menu-button board-item-menu-button-${
                board.id
              }`}
              label={intl.formatMessage(messages.menu)}
              onClick={this.openMenu.bind(this)}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              className={`board-item-menu board-item-menu-${board.id}`}
              anchorEl={this.state.menu}
              open={Boolean(this.state.menu)}
              onClose={this.closeMenu.bind(this)}
            >
              {selectedTab === TAB_INDEXES.COMMUNICATOR_BOARDS &&
                communicator.rootBoard !== board.id &&
                !!userData.authToken && (
                  <MenuItem
                    onClick={() => {
                      this.setRootBoard(board);
                    }}
                  >
                    <FormattedMessage {...messages.menuRootBoardOption} />
                  </MenuItem>
                )}
              {selectedTab === TAB_INDEXES.MY_BOARDS && (
                <MenuItem
                  onClick={() => {
                    this.publishBoardAction(board);
                  }}
                >
                  <FormattedMessage
                    {...(board.isPublic
                      ? messages.menuUnpublishOption
                      : messages.menuPublishOption)}
                  />
                </MenuItem>
              )}
              <MenuItem onClick={() => {}}>...</MenuItem>
            </Menu>
          </div>

          <div className="CommunicatorDialog__boards__item__data__title">
            {title}
          </div>
          <div className="CommunicatorDialog__boards__item__data__author">
            {intl.formatMessage(messages.author, { author: board.author })}
          </div>
          <div className="CommunicatorDialog__boards__item__data__extra">
            {selectedTab === TAB_INDEXES.ALL_BOARDS && <PublicIcon />}
            {selectedTab === TAB_INDEXES.MY_BOARDS &&
              board.isPublic && <PublicIcon />}
            {selectedTab === TAB_INDEXES.MY_BOARDS &&
              !board.isPublic && <KeyIcon />}
          </div>
        </div>
      </div>
    );
  }
}

CommunicatorBoardItem.propTypes = {
  intl: intlShape,
  communicator: PropTypes.object,
  selectedTab: PropTypes.number,
  board: PropTypes.object,
  userData: PropTypes.object,
  addOrRemoveBoard: PropTypes.func.isRequired,
  publishBoardAction: PropTypes.func.isRequired,
  setRootBoard: PropTypes.func.isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.string)
};

export default CommunicatorBoardItem;
