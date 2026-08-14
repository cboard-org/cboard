import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { alpha, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import StarIcon from '@material-ui/icons/Star';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PublicIcon from '@material-ui/icons/Public';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import {
  SECTIONS,
  SECTION_ORDER,
  NAV_COLLAPSED_STORAGE_KEY
} from '../CommunicatorDialog.constants';
import messages from '../CommunicatorDialog.messages';

export const NAV_WIDTH = 260;
export const NAV_WIDTH_COLLAPSED = 64;

// Icons are static; message lookups are done at render time so importing this
// module has no side effects (react-intl is auto-mocked in tests).
const SECTION_ICONS = {
  [SECTIONS.MY_BOARDS]: DashboardIcon,
  [SECTIONS.MY_COMMUNICATOR]: StarIcon,
  [SECTIONS.COMMUNITY]: PublicIcon
};

const SECTION_LABELS = {
  [SECTIONS.MY_BOARDS]: {
    label: 'sectionMyBoards',
    hint: 'sectionMyBoardsHint'
  },
  [SECTIONS.MY_COMMUNICATOR]: {
    label: 'sectionQuickAccess',
    hint: 'sectionQuickAccessHint'
  },
  [SECTIONS.COMMUNITY]: {
    label: 'sectionCommunity',
    hint: 'sectionCommunityHint'
  }
};

const readStoredCollapsed = () => {
  try {
    return window.localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY) === 'true';
  } catch (e) {
    return false;
  }
};

const useStyles = makeStyles((theme) => {
  const dark = theme.palette.type === 'dark';
  const widthTransition = theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  });
  return {
    docked: {
      height: '100%'
    },
    drawerPaper: {
      width: NAV_WIDTH,
      position: 'relative',
      border: 'none',
      borderRight: `1px solid ${theme.palette.divider}`,
      overflowX: 'hidden',
      transition: widthTransition,
      // Subtly recede the sidebar from the content surface in both modes.
      backgroundColor: dark
        ? alpha(theme.palette.common.white, 0.03)
        : theme.palette.grey[50]
    },
    drawerPaperCollapsed: {
      width: NAV_WIDTH_COLLAPSED
    },
    temporaryPaper: {
      width: NAV_WIDTH,
      backgroundColor: dark
        ? theme.palette.background.paper
        : theme.palette.grey[50]
    },
    toggleRow: {
      display: 'flex',
      justifyContent: 'flex-start',
      padding: theme.spacing(1.5, 0, 1.5, 0.75)
    },
    toggleButton: {
      '& svg': {
        fontSize: '1.75rem'
      }
    },
    list: {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(1.5)
    },
    item: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius * 2,
      margin: theme.spacing(0.25, 1),
      padding: theme.spacing(1, 1.5),
      width: 'auto',
      transition: theme.transitions.create(['background-color']),
      // Left accent bar that grows in when the section is selected.
      '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 3,
        height: 0,
        borderRadius: 3,
        backgroundColor: theme.palette.primary.main,
        transition: theme.transitions.create('height')
      },
      '&.Mui-selected': {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.18)
        },
        '&::before': {
          height: '60%'
        }
      }
    },
    // Padding and icon slot stay identical in both states: margin (8) +
    // padding (12) + half the icon (12) puts the glyph on the centre line of
    // the collapsed rail, so it never travels during the width animation.
    itemIcon: {
      minWidth: 40
    },
    // The label keeps a fixed width and never wraps, so the shrinking paper
    // clips it instead of reflowing it; opacity does the visible work.
    itemText: {
      flex: '0 0 auto',
      width: NAV_WIDTH - 88,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      opacity: 1,
      transition: theme.transitions.create('opacity', {
        duration: theme.transitions.duration.enteringScreen,
        delay: theme.transitions.duration.shortest
      })
    },
    itemTextCollapsed: {
      opacity: 0,
      transition: theme.transitions.create('opacity', {
        duration: theme.transitions.duration.shortest
      })
    },
    selectedIcon: {
      color: theme.palette.primary.main
    },
    selectedText: {
      color: theme.palette.primary.main,
      fontWeight: 600
    }
  };
});

const NavList = ({ intl, section, onChange, collapsed }) => {
  const classes = useStyles();
  return (
    <List className={classes.list} component="nav">
      {SECTION_ORDER.map((key) => {
        const meta = SECTION_LABELS[key];
        const Icon = SECTION_ICONS[key];
        const selected = section === key;
        const label = intl.formatMessage(messages[meta.label]);
        const item = (
          <ListItem
            button
            key={key}
            id={`CommunicatorDialog__nav-${key}`}
            selected={selected}
            className={classes.item}
            onClick={() => onChange(key)}
            aria-current={selected ? 'page' : undefined}
          >
            <ListItemIcon
              className={`${classes.itemIcon} ${
                selected ? classes.selectedIcon : ''
              }`}
            >
              <Icon />
            </ListItemIcon>
            <ListItemText
              className={`${classes.itemText} ${
                collapsed ? classes.itemTextCollapsed : ''
              }`}
              primaryTypographyProps={{
                noWrap: true,
                className: selected ? classes.selectedText : undefined
              }}
              secondaryTypographyProps={{ noWrap: true }}
              primary={label}
              secondary={intl.formatMessage(messages[meta.hint])}
            />
          </ListItem>
        );

        // Collapsed items show only the icon, so the label also goes in a
        // tooltip (which MUI exposes on keyboard focus too).
        return collapsed ? (
          <Tooltip key={key} title={label} placement="right">
            {item}
          </Tooltip>
        ) : (
          item
        );
      })}
    </List>
  );
};

const DashboardNav = ({
  intl,
  section,
  onChange,
  mobileOpen,
  onMobileClose
}) => {
  const classes = useStyles();
  const [collapsed, setCollapsed] = useState(readStoredCollapsed);

  const handleChange = (key) => {
    onChange(key);
    onMobileClose();
  };

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      window.localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, String(next));
    } catch (e) {
      // storage unavailable (private mode) — collapse state stays session-only
    }
  };

  const toggleLabel = intl.formatMessage(
    collapsed ? messages.expandNavigation : messages.collapseNavigation
  );

  return (
    <>
      <Hidden xsDown implementation="css" className={classes.docked}>
        <Drawer
          variant="permanent"
          open
          classes={{
            docked: classes.docked,
            paper: `${classes.drawerPaper} ${
              collapsed ? classes.drawerPaperCollapsed : ''
            }`
          }}
        >
          <div className={classes.toggleRow}>
            <Tooltip title={toggleLabel} placement="right">
              <IconButton
                className={classes.toggleButton}
                onClick={handleToggle}
                aria-label={toggleLabel}
                aria-expanded={!collapsed}
                aria-controls="CommunicatorDialog__nav-list"
              >
                {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </Tooltip>
          </div>
          <div id="CommunicatorDialog__nav-list">
            <NavList
              intl={intl}
              section={section}
              onChange={onChange}
              collapsed={collapsed}
            />
          </div>
        </Drawer>
      </Hidden>
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onMobileClose}
          ModalProps={{ keepMounted: true }}
          classes={{ paper: classes.temporaryPaper }}
        >
          <NavList intl={intl} section={section} onChange={handleChange} />
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardNav.propTypes = {
  intl: intlShape.isRequired,
  section: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  mobileOpen: PropTypes.bool,
  onMobileClose: PropTypes.func
};

DashboardNav.defaultProps = {
  mobileOpen: false,
  onMobileClose: () => {}
};

export default DashboardNav;
