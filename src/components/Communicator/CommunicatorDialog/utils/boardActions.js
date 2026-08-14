import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import QueueIcon from '@material-ui/icons/Queue';
import InfoIcon from '@material-ui/icons/Info';
import FlagIcon from '@material-ui/icons/Flag';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PublicIcon from '@material-ui/icons/Public';
import KeyIcon from '@material-ui/icons/VpnKey';
import VisibilityIcon from '@material-ui/icons/Visibility';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import GetAppIcon from '@material-ui/icons/GetApp';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';

import { SECTIONS } from '../CommunicatorDialog.constants';
import messages from '../CommunicatorDialog.messages';

/**
 * The single source of truth for what a board can do in a given section.
 *
 * Returns ONE flat array of descriptors. Both the desktop details panel and
 * the phone bottom sheet render straight from it, so an action cannot exist
 * without being visible and labelled.
 *
 * Descriptor shape:
 *   { key, label, icon, onClick, disabled, premium, destructive }
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
  const t = (msg) => intl.formatMessage(msg);

  const infoAction = {
    key: 'info',
    label: t(messages.boardInfo),
    icon: <InfoIcon />,
    onClick: () => handlers.onShowInfo(board)
  };

  const setRootAction = {
    key: 'setRoot',
    label: t(messages.menuRootBoardOption),
    icon: <HomeIcon />,
    disabled: isRoot || !hasAuth,
    onClick: () => handlers.onSetRoot(board)
  };

  const quickAccessAction = {
    key: 'addRemove',
    label: inCommunicator
      ? t(messages.removeFromQuickAccess)
      : t(messages.addToQuickAccess),
    icon: inCommunicator ? <StarIcon /> : <StarBorderIcon />,
    disabled: isRoot,
    onClick: () => handlers.onAddRemove(board)
  };

  switch (section) {
    case SECTIONS.MY_COMMUNICATOR:
      return [setRootAction, quickAccessAction, infoAction];

    case SECTIONS.COMMUNITY:
      return [
        {
          key: 'copy',
          label: t(messages.copyBoard),
          icon: <QueueIcon />,
          disabled: inCommunicator || isOwnBoard,
          premium: true,
          onClick: () => handlers.onCopy(board)
        },
        infoAction,
        {
          key: 'report',
          label: t(messages.boardReport),
          icon: <FlagIcon />,
          disabled: !hasAuth,
          onClick: () => handlers.onReport(board)
        }
      ];

    case SECTIONS.MY_BOARDS:
      return [
        {
          key: 'show',
          label: t(messages.showBoard),
          icon: <VisibilityIcon />,
          onClick: () => handlers.onShow(board)
        },
        {
          key: 'edit',
          label: t(messages.editBoardTitle),
          icon: <EditIcon />,
          onClick: () => handlers.onEdit(board)
        },
        {
          // Ships disabled on purpose: the handler is not implemented yet.
          // A labelled button that appears to work and silently does nothing
          // is worse than one that is visibly unavailable.
          key: 'clone',
          label: t(messages.cloneBoard),
          icon: <FileCopyIcon />,
          disabled: true,
          hint: t(messages.cloneBoardUnavailable),
          onClick: () => {}
        },
        {
          key: 'export',
          label: t(messages.exportBoard),
          icon: <GetAppIcon />,
          onClick: () => handlers.onExport(board)
        },
        {
          key: 'exportPdf',
          label: t(messages.exportBoardToPdf),
          icon: <PictureAsPdfIcon />,
          onClick: () => handlers.onExportPdf(board)
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
        setRootAction,
        quickAccessAction,
        infoAction,
        {
          key: 'delete',
          label: t(messages.deleteBoard),
          icon: <DeleteIcon />,
          disabled: isRoot || isActive,
          destructive: true,
          onClick: () => handlers.onDelete(board)
        }
      ];

    default:
      return [];
  }
};

export default getBoardActions;
