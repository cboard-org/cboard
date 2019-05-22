import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, FormattedMessage } from 'react-intl';
import MenuIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/AddCircle';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import PublicIcon from '@material-ui/icons/Public';
import KeyIcon from '@material-ui/icons/VpnKey';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import DeleteIcon from '@material-ui/icons/Delete';
import InputIcon from '@material-ui/icons/Input';
import ClearIcon from '@material-ui/icons/Clear';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import IconButton from '../../UI/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { TAB_INDEXES } from './CommunicatorDialog.constants';
import messages from './CommunicatorDialog.messages';
import { List, ListItemSecondaryAction, Button } from '@material-ui/core';

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

  async publishBoardAction(board) {
    await this.props.publishBoardAction(board);
    this.setState({ menu: null });
  }

  async setRootBoard(board) {
    await this.props.setRootBoard(board);
    this.setState({ menu: null });
  }

  render() {
    const {
      board,
      selectedTab,
      intl,
      selectedIds,
      userData,
      communicator,
      addOrRemoveBoard
    } = this.props;
    const title = board.name || board.id;
    const displayActions =
      selectedTab === TAB_INDEXES.MY_BOARDS ||
      selectedTab === TAB_INDEXES.PUBLIC_BOARDS ||
      (selectedTab === TAB_INDEXES.COMMUNICATOR_BOARDS && !!userData.authToken);
    return (
      <div className="CommunicatorDialog__boards__item">
        <div className="CommunicatorDialog__boards__item__image">
          {!!board.caption && <img src={board.caption} alt={title} />}
          {!board.caption && (
            <div className="CommunicatorDialog__boards__item__image__empty">
              <ViewModuleIcon />
            </div>
          )}
          {(communicator.rootBoard !== board.id || !userData.authToken) && (
            <div className="CommunicatorDialog__boards__item__image__button">
              <IconButton
                disabled={!userData.authToken}
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
          <div className="CommunicatorDialog__boards__item__data__title">
            <ListItem
              disableGutters={true}
            >
              <ListItemText
                primary={title}
                secondary={intl.formatMessage(messages.tilesQty, { qty: board.tiles.length })}
              />
            </ListItem>
          </div>
          <div className="CommunicatorDialog__boards__item__data__author">
            {intl.formatMessage(messages.author, { author: board.author })}
          </div>
          <div className="CommunicatorDialog__boards__item__data__extra">
            {selectedTab === TAB_INDEXES.PUBLIC_BOARDS && <PublicIcon />}
            {selectedTab === TAB_INDEXES.MY_BOARDS &&
              board.isPublic && <PublicIcon />}
            {selectedTab === TAB_INDEXES.MY_BOARDS &&
              !board.isPublic && <KeyIcon />}
          </div>
        </div>
        <div className="CommunicatorDialog__boards__item__actions">
          {displayActions &&
            (
            <div>
              {selectedTab === TAB_INDEXES.COMMUNICATOR_BOARDS && (
                <div>
                  <IconButton
                    disabled={!userData.authToken}
                    label={intl.formatMessage(messages.removeBoard)}
                    onClick={() => {
                      addOrRemoveBoard(board);
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                  <IconButton
                    disabled={communicator.rootBoard === board.id}
                    onClick={() => {
                      this.setRootBoard(board);
                    }}
                    label={intl.formatMessage(messages.menuRootBoardOption)}
                  >
                    <HomeIcon />
                  </IconButton>
                </div>
              )}
              {selectedTab === TAB_INDEXES.PUBLIC_BOARDS && (
                <div>
                  <IconButton
                    onClick={() => {
                      addOrRemoveBoard(board);
                    }}
                    label={intl.formatMessage(messages.addBoard)}
                  >
                    <InputIcon />
                  </IconButton>
                  <IconButton
                    label={intl.formatMessage(messages.boardInfo)}
                  >
                    <InfoIcon />
                  </IconButton>
                </div>
              )}
              {selectedTab === TAB_INDEXES.MY_BOARDS && (
                <div>
                  <IconButton
                    label={intl.formatMessage(messages.addBoard)}
                    onClick={() => {
                      addOrRemoveBoard(board);
                    }}
                  ><InputIcon /></IconButton>
                  <IconButton
                    label={intl.formatMessage(messages.removeBoard)}
                  ><DeleteIcon /></IconButton>
                  <IconButton
                    label={intl.formatMessage(messages.menuPublishOption)}
                  ><PublicIcon /></IconButton>
                </div>
              )}
            </div>
            )}
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
