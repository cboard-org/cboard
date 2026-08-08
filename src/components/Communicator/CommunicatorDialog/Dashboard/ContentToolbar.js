import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { alpha, makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ViewListIcon from '@material-ui/icons/ViewList';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { VIEW_MODES } from '../CommunicatorDialog.constants';
import messages from '../CommunicatorDialog.messages';

const FIELD_HEIGHT = 40;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(1.5),
    flex: '1 1 300px',
    minWidth: 0
  },
  search: {
    position: 'relative',
    height: FIELD_HEIGHT,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    maxWidth: 380,
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
      borderColor: alpha(theme.palette.text.primary, 0.4)
    },
    '&:focus-within': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 1.25),
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.secondary
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
  clearButton: {
    color: theme.palette.text.secondary
  },
  toggleGroup: {
    height: FIELD_HEIGHT,
    flexShrink: 0
  },
  toggleButton: {
    padding: theme.spacing(0, 1.25),
    color: theme.palette.text.secondary,
    borderRadius: theme.shape.borderRadius * 2,
    transition: theme.transitions.create(['background-color', 'color']),
    '&.Mui-selected': {
      color: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.18)
      }
    }
  }
}));

const ContentToolbar = ({
  intl,
  search,
  onSearchChange,
  viewMode,
  onViewModeChange
}) => {
  const classes = useStyles();

  const handleViewMode = (event, value) => {
    if (value) onViewModeChange(value);
  };

  return (
    <div className={classes.root}>
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
            className={classes.clearButton}
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
    </div>
  );
};

ContentToolbar.propTypes = {
  intl: intlShape.isRequired,
  search: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  viewMode: PropTypes.string.isRequired,
  onViewModeChange: PropTypes.func.isRequired
};

export default ContentToolbar;
