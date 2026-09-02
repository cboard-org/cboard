import React from 'react';
import PublicIcon from '@material-ui/icons/Public';
import KeyIcon from '@material-ui/icons/VpnKey';
import HomeIcon from '@material-ui/icons/Home';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';

import messages from '../CommunicatorDialog.messages';

/**
 * The statuses a board can carry, in a fixed order, shared by every surface
 * that shows them (cards, rows, details panel, quick access) so a board never
 * reads differently depending on where it is displayed. `tone` names the
 * semantic color; each surface maps it to its own class. `title` is the full
 * phrase (tooltips, labels for assistive tech); `label` is the bare status for
 * badges, where the surrounding context already says "board".
 *
 * Visibility is opt-out: in the quick access tray every row is one of the
 * user's own boards, so a "Private Board" badge on each of them is noise that
 * competes with the two statuses that do vary there.
 */
export const getBoardStatusItems = (
  intl,
  { isPublic, isRoot, isActive, showVisibility = true }
) => {
  const items = [];

  if (showVisibility) {
    items.push({
      key: 'visibility',
      title: intl.formatMessage(
        isPublic ? messages.publicBoard : messages.privateBoard
      ),
      label: intl.formatMessage(
        isPublic ? messages.statusPublic : messages.statusPrivate
      ),
      icon: isPublic ? <PublicIcon /> : <KeyIcon />,
      tone: isPublic ? 'public' : 'private'
    });
  }

  if (isRoot) {
    items.push({
      key: 'root',
      title: intl.formatMessage(messages.rootBoard),
      label: intl.formatMessage(messages.statusRoot),
      icon: <HomeIcon />,
      tone: 'root'
    });
  }

  if (isActive) {
    items.push({
      key: 'active',
      title: intl.formatMessage(messages.activeBoard),
      label: intl.formatMessage(messages.statusActive),
      icon: <RemoveRedEyeIcon />,
      tone: 'active'
    });
  }

  return items;
};
