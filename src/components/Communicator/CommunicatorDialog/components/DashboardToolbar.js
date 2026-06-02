import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { intlShape, FormattedMessage } from 'react-intl';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import messages from '../CommunicatorDialog.messages';

/**
 * AppBar overflow menu (help / terms). Search and the grid/list selector live
 * in the content area (ContentToolbar) and the navigation toggle lives in the
 * section header, so the top bar stays uncluttered.
 */
const DashboardToolbar = ({ intl }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);

  return (
    <>
      <Tooltip title={intl.formatMessage(messages.menu)}>
        <IconButton
          color="inherit"
          edge="end"
          aria-label={intl.formatMessage(messages.menu)}
          aria-haspopup="true"
          onClick={event => setMenuAnchor(event.currentTarget)}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={menuAnchor}
        keepMounted
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          component={Link}
          to="/settings/help"
          onClick={() => setMenuAnchor(null)}
        >
          <FormattedMessage {...messages.helpAndSupport} />
        </MenuItem>
        <MenuItem
          component="a"
          href="https://www.cboard.io/terms-of-use/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuAnchor(null)}
        >
          <FormattedMessage {...messages.termsOfService} />
        </MenuItem>
      </Menu>
    </>
  );
};

DashboardToolbar.propTypes = {
  intl: intlShape.isRequired
};

export default DashboardToolbar;
