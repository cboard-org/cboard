import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { alpha, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { SECTIONS } from '../CommunicatorDialog.constants';
import messages from '../CommunicatorDialog.messages';

// Message keys resolved at render time (react-intl is auto-mocked in tests, so
// the imported `messages` object is undefined there — avoid top-level access).
const SECTION_LABELS = {
  [SECTIONS.MY_COMMUNICATOR]: {
    title: 'sectionQuickAccess',
    hint: 'sectionQuickAccessHint'
  },
  [SECTIONS.MY_BOARDS]: {
    title: 'sectionMyBoards',
    hint: 'sectionMyBoardsHint'
  },
  [SECTIONS.COMMUNITY]: {
    title: 'sectionCommunity',
    hint: 'sectionCommunityHint'
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flex: '1 1 240px',
    minWidth: 0
  },
  navButton: {
    marginLeft: theme.spacing(-1),
    // Only relevant while the sidebar is hidden (xs).
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  titleBlock: {
    flex: 1,
    minWidth: 0
  },
  title: {
    fontWeight: 700,
    letterSpacing: '-0.01em',
    lineHeight: 1.2
  },
  hint: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.25),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  chip: {
    flexShrink: 0,
    fontWeight: 600,
    color: theme.palette.primary.main,
    borderColor: alpha(theme.palette.primary.main, 0.4),
    backgroundColor: alpha(theme.palette.primary.main, 0.08)
  }
}));

const SectionHeader = ({ intl, section, total, onOpenNav }) => {
  const classes = useStyles();
  const meta = SECTION_LABELS[section];

  return (
    <div className={classes.root}>
      {onOpenNav && (
        <IconButton
          className={classes.navButton}
          edge="start"
          aria-label={intl.formatMessage(messages.navigation)}
          onClick={onOpenNav}
        >
          <MenuIcon />
        </IconButton>
      )}
      <div className={classes.titleBlock}>
        <Typography variant="h6" component="h2" className={classes.title}>
          {intl.formatMessage(messages[meta.title])}
        </Typography>
        <Typography variant="body2" className={classes.hint}>
          {intl.formatMessage(messages[meta.hint])}
        </Typography>
      </div>
      <Chip
        size="small"
        variant="outlined"
        className={classes.chip}
        label={intl.formatMessage(messages.boardsQty, { qty: total })}
      />
    </div>
  );
};

SectionHeader.propTypes = {
  intl: intlShape.isRequired,
  section: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  onOpenNav: PropTypes.func
};

export default SectionHeader;
