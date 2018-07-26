import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
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
      menu: null
    };
  }

  openMenu(e) {
    this.setState({ menu: e.currentTarget });
  }

  closeMenu() {
    this.setState({ menu: null });
  }

  render() {
    const { board, selectedTab, intl } = this.props;
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
          <div className="CommunicatorDialog__boards__item__image__button">
            <IconButton
              label={intl.formatMessage(
                selectedTab === TAB_INDEXES.COMMUNICATOR_BOARDS
                  ? messages.removeBoard
                  : messages.addBoard
              )}
              onClick={() => {}}
            >
              {selectedTab === TAB_INDEXES.COMMUNICATOR_BOARDS ? (
                <RemoveIcon />
              ) : (
                <AddIcon />
              )}
            </IconButton>
          </div>
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
  selectedTab: PropTypes.number,
  board: PropTypes.object
};

export default CommunicatorBoardItem;
