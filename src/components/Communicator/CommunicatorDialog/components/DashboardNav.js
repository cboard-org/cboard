import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { alpha, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PublicIcon from '@material-ui/icons/Public';

import { SECTIONS, SECTION_ORDER } from '../CommunicatorDialog.constants';
import messages from '../CommunicatorDialog.messages';

export const NAV_WIDTH = 260;

// Icons are static; message lookups are done at render time so importing this
// module has no side effects (react-intl is auto-mocked in tests).
const SECTION_ICONS = {
  [SECTIONS.MY_BOARDS]: DashboardIcon,
  [SECTIONS.MY_COMMUNICATOR]: RecordVoiceOverIcon,
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

const useStyles = makeStyles(theme => {
  const dark = theme.palette.type === 'dark';
  return {
    docked: {
      height: '100%'
    },
    drawerPaper: {
      width: NAV_WIDTH,
      position: 'relative',
      border: 'none',
      borderRight: `1px solid ${theme.palette.divider}`,
      // Subtly recede the sidebar from the content surface in both modes.
      backgroundColor: dark
        ? alpha(theme.palette.common.white, 0.03)
        : theme.palette.grey[50]
    },
    temporaryPaper: {
      width: NAV_WIDTH,
      backgroundColor: dark
        ? theme.palette.background.paper
        : theme.palette.grey[50]
    },
    header: {
      padding: theme.spacing(2, 2, 1),
      color: theme.palette.text.secondary,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase'
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
    itemIcon: {
      minWidth: 40
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

const NavList = ({ intl, section, onChange }) => {
  const classes = useStyles();
  return (
    <>
      <Typography variant="overline" component="div" className={classes.header}>
        {intl.formatMessage(messages.navigation)}
      </Typography>
      <List className={classes.list} component="nav">
        {SECTION_ORDER.map(key => {
          const meta = SECTION_LABELS[key];
          const Icon = SECTION_ICONS[key];
          const selected = section === key;
          return (
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
                primaryTypographyProps={{
                  className: selected ? classes.selectedText : undefined
                }}
                primary={intl.formatMessage(messages[meta.label])}
                secondary={intl.formatMessage(messages[meta.hint])}
              />
            </ListItem>
          );
        })}
      </List>
    </>
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

  const handleChange = key => {
    onChange(key);
    onMobileClose();
  };

  return (
    <>
      <Hidden xsDown implementation="css" className={classes.docked}>
        <Drawer
          variant="permanent"
          open
          classes={{ docked: classes.docked, paper: classes.drawerPaper }}
        >
          <NavList intl={intl} section={section} onChange={onChange} />
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
