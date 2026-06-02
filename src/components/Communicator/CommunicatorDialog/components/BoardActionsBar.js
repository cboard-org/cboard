import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import HomeIcon from '@material-ui/icons/Home';
import ClearIcon from '@material-ui/icons/Clear';
import InputIcon from '@material-ui/icons/Input';
import QueueIcon from '@material-ui/icons/Queue';
import InfoIcon from '@material-ui/icons/Info';
import FlagIcon from '@material-ui/icons/Flag';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PublicIcon from '@material-ui/icons/Public';
import KeyIcon from '@material-ui/icons/VpnKey';

import PremiumFeature from '../../../PremiumFeature';
import { SECTIONS } from '../CommunicatorDialog.constants';
import messages from '../CommunicatorDialog.messages';

/**
 * Builds the list of available actions for a board given the current section.
 * Returns { primary, menu } descriptors so BoardCard and BoardRow render the
 * exact same behaviour. Each descriptor: { key, label, icon, onClick,
 * disabled, premium }.
 */
export const getBoardActions = ({
  section,
  board,
  communicator,
  userData,
  activeBoardId,
  handlers,
  intl
}) => {
  const isRoot = communicator.rootBoard === board.id;
  const isActive = activeBoardId === board.id;
  const inCommunicator = communicator.boards.includes(board.id);
  const hasAuth = !!(userData && userData.authToken);
  const isOwnBoard = !!(userData && userData.email === board.email);
  const t = msg => intl.formatMessage(msg);

  const infoAction = {
    key: 'info',
    label: t(messages.boardInfo),
    icon: <InfoIcon />,
    onClick: () => handlers.onShowInfo(board)
  };

  switch (section) {
    case SECTIONS.MY_COMMUNICATOR:
      return {
        primary: [
          {
            key: 'setRoot',
            label: t(messages.menuRootBoardOption),
            icon: <HomeIcon />,
            disabled: isRoot || !hasAuth,
            onClick: () => handlers.onSetRoot(board)
          }
        ],
        menu: [
          {
            key: 'remove',
            label: t(messages.removeBoard),
            icon: <ClearIcon />,
            disabled: isRoot || !hasAuth,
            onClick: () => handlers.onAddRemove(board)
          },
          infoAction
        ]
      };

    case SECTIONS.COMMUNITY:
      return {
        primary: [
          {
            key: 'copy',
            label: t(messages.copyBoard),
            icon: <QueueIcon />,
            disabled: inCommunicator || isOwnBoard,
            premium: true,
            onClick: () => handlers.onCopy(board)
          }
        ],
        menu: [
          infoAction,
          {
            key: 'report',
            label: t(messages.boardReport),
            icon: <FlagIcon />,
            disabled: !hasAuth,
            onClick: () => handlers.onReport(board)
          }
        ]
      };

    case SECTIONS.MY_BOARDS:
      return {
        primary: [
          {
            key: 'addRemove',
            label: inCommunicator
              ? t(messages.removeBoard)
              : t(messages.addBoard),
            icon: inCommunicator ? <ClearIcon /> : <InputIcon />,
            disabled: isRoot,
            onClick: () => handlers.onAddRemove(board)
          }
        ],
        menu: [
          {
            key: 'edit',
            label: t(messages.editBoardTitle),
            icon: <EditIcon />,
            onClick: () => handlers.onEdit(board)
          },
          {
            key: 'publish',
            label: board.isPublic
              ? t(messages.menuUnpublishOption)
              : t(messages.menuPublishOption),
            icon: board.isPublic ? <KeyIcon /> : <PublicIcon />,
            premium: !!(board.description || board.isPublic),
            onClick: () => handlers.onPublishToggle(board)
          },
          {
            key: 'delete',
            label: t(messages.deleteBoard),
            icon: <DeleteIcon />,
            disabled: isRoot || isActive,
            onClick: () => handlers.onDelete(board)
          },
          infoAction
        ]
      };

    default:
      return { primary: [], menu: [] };
  }
};

const PrimaryButton = ({ action }) => {
  const button = (
    <IconButton
      size="small"
      aria-label={action.label}
      disabled={action.disabled}
      onClick={action.onClick}
    >
      {action.icon}
    </IconButton>
  );
  const wrapped = action.premium ? (
    <PremiumFeature>{button}</PremiumFeature>
  ) : (
    button
  );
  return (
    <Tooltip title={action.label}>
      <span>{wrapped}</span>
    </Tooltip>
  );
};

const BoardActionsBar = ({
  intl,
  board,
  section,
  communicator,
  userData,
  activeBoardId,
  handlers
}) => {
  const [anchor, setAnchor] = useState(null);
  const { primary, menu } = getBoardActions({
    section,
    board,
    communicator,
    userData,
    activeBoardId,
    handlers,
    intl
  });

  const handleMenuClick = action => {
    setAnchor(null);
    action.onClick();
  };

  return (
    <div
      className="CommunicatorDialog__boardActions"
      style={{ display: 'flex', alignItems: 'center' }}
    >
      {primary.map(action => (
        <PrimaryButton key={action.key} action={action} />
      ))}

      {menu.length > 0 && (
        <>
          <Tooltip title={intl.formatMessage(messages.boardActions)}>
            <IconButton
              size="small"
              aria-label={intl.formatMessage(messages.boardActions)}
              aria-haspopup="true"
              onClick={event => setAnchor(event.currentTarget)}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchor}
            open={Boolean(anchor)}
            onClose={() => setAnchor(null)}
          >
            {menu.map(action => {
              const item = (
                <MenuItem
                  key={action.key}
                  disabled={action.disabled}
                  onClick={() => handleMenuClick(action)}
                >
                  <ListItemIcon style={{ minWidth: 36 }}>
                    {action.icon}
                  </ListItemIcon>
                  <ListItemText primary={action.label} />
                </MenuItem>
              );
              return action.premium ? (
                <PremiumFeature key={action.key}>{item}</PremiumFeature>
              ) : (
                item
              );
            })}
          </Menu>
        </>
      )}
    </div>
  );
};

BoardActionsBar.propTypes = {
  intl: intlShape.isRequired,
  board: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired,
  communicator: PropTypes.object.isRequired,
  userData: PropTypes.object,
  activeBoardId: PropTypes.string,
  handlers: PropTypes.object.isRequired
};

export default BoardActionsBar;
