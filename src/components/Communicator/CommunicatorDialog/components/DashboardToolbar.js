import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { intlShape, FormattedMessage } from 'react-intl';
import { alpha, makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ViewListIcon from '@material-ui/icons/ViewList';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { VIEW_MODES } from '../CommunicatorDialog.constants';
import messages from '../CommunicatorDialog.messages';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flex: 1,
    minWidth: 0,
    paddingRight: theme.spacing(1)
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25)
    },
    flex: 1,
    minWidth: 0,
    maxWidth: 420,
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    padding: theme.spacing(0, 1.5),
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center'
  },
  inputRoot: {
    color: 'inherit',
    flex: 1,
    minWidth: 0
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    width: '100%'
  },
  toggleGroup: {
    backgroundColor: alpha(theme.palette.common.white, 0.12)
  },
  toggleButton: {
    color: alpha(theme.palette.common.white, 0.7),
    border: 'none',
    padding: theme.spacing(0.75),
    '&.Mui-selected': {
      color: theme.palette.common.white,
      backgroundColor: alpha(theme.palette.common.white, 0.22)
    }
  },
  hideXs: {
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  }
}));

const DashboardToolbar = ({
  intl,
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onOpenNav
}) => {
  const classes = useStyles();
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleViewMode = (event, value) => {
    if (value) onViewModeChange(value);
  };

  return (
    <div className={classes.root}>
      {onOpenNav && (
        <IconButton
          color="inherit"
          edge="start"
          aria-label={intl.formatMessage(messages.navigation)}
          onClick={onOpenNav}
        >
          <MenuIcon />
        </IconButton>
      )}

      <div className={classes.search} id="CommunicatorDialog__search">
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          value={search}
          onChange={event => onSearchChange(event.target.value)}
          placeholder={intl.formatMessage(messages.searchBoardsPlaceholder)}
          classes={{ root: classes.inputRoot, input: classes.inputInput }}
          inputProps={{ 'aria-label': intl.formatMessage(messages.search) }}
        />
        {!!search && (
          <IconButton
            size="small"
            color="inherit"
            aria-label={intl.formatMessage(messages.clearSearch)}
            onClick={() => onSearchChange('')}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
      </div>

      <ToggleButtonGroup
        className={classes.toggleGroup}
        value={viewMode}
        exclusive
        size="small"
        onChange={handleViewMode}
      >
        <ToggleButton
          className={classes.toggleButton}
          value={VIEW_MODES.GRID}
          aria-label={intl.formatMessage(messages.gridView)}
        >
          <Tooltip title={intl.formatMessage(messages.gridView)}>
            <ViewModuleIcon fontSize="small" />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          className={classes.toggleButton}
          value={VIEW_MODES.LIST}
          aria-label={intl.formatMessage(messages.listView)}
        >
          <Tooltip title={intl.formatMessage(messages.listView)}>
            <ViewListIcon fontSize="small" />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>

      <IconButton
        color="inherit"
        aria-label={intl.formatMessage(messages.menu)}
        aria-haspopup="true"
        onClick={event => setMenuAnchor(event.currentTarget)}
      >
        <MoreVertIcon />
      </IconButton>
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
    </div>
  );
};

DashboardToolbar.propTypes = {
  intl: intlShape.isRequired,
  search: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  viewMode: PropTypes.string.isRequired,
  onViewModeChange: PropTypes.func.isRequired,
  onOpenNav: PropTypes.func
};

export default DashboardToolbar;
