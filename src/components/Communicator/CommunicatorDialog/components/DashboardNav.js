import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PublicIcon from '@material-ui/icons/Public';

import { SECTIONS, SECTION_ORDER } from '../CommunicatorDialog.constants';
import messages from '../CommunicatorDialog.messages';

export const NAV_WIDTH = 260;

// Icons are static; message lookups are done at render time so importing this
// module has no side effects (react-intl is auto-mocked in tests).
const SECTION_ICONS = {
  [SECTIONS.MY_COMMUNICATOR]: RecordVoiceOverIcon,
  [SECTIONS.MY_BOARDS]: DashboardIcon,
  [SECTIONS.COMMUNITY]: PublicIcon
};

const SECTION_LABELS = {
  [SECTIONS.MY_COMMUNICATOR]: {
    label: 'sectionMyCommunicator',
    hint: 'sectionMyCommunicatorHint'
  },
  [SECTIONS.MY_BOARDS]: {
    label: 'sectionMyBoards',
    hint: 'sectionMyBoardsHint'
  },
  [SECTIONS.COMMUNITY]: {
    label: 'sectionCommunity',
    hint: 'sectionCommunityHint'
  }
};

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: NAV_WIDTH,
    position: 'relative',
    border: 'none',
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper
  },
  temporaryPaper: {
    width: NAV_WIDTH
  },
  list: {
    paddingTop: theme.spacing(1)
  },
  item: {
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(0.5, 1),
    width: 'auto',
    '&.Mui-selected': {
      backgroundColor: alphaSelected(theme),
      '&:hover': {
        backgroundColor: alphaSelected(theme)
      }
    }
  },
  selectedIcon: {
    color: theme.palette.primary.main
  },
  selectedText: {
    color: theme.palette.primary.main,
    fontWeight: 600
  }
}));

function alphaSelected(theme) {
  return theme.palette.type === 'dark'
    ? 'rgba(255, 255, 255, 0.12)'
    : 'rgba(63, 81, 181, 0.12)';
}

const NavList = ({ intl, section, onChange }) => {
  const classes = useStyles();
  return (
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
              className={selected ? classes.selectedIcon : undefined}
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
      <Hidden xsDown implementation="css">
        <Drawer
          variant="permanent"
          open
          classes={{ paper: classes.drawerPaper }}
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
