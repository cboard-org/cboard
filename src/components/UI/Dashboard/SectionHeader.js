import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import TonalChip from '../TonalChip';
import messages from './Dashboard.messages';

const useStyles = makeStyles((theme) => ({
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
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
    flexShrink: 0
  }
}));

// Renders the title/description as one grid item and the chip as a second,
// separate grid item so the parent header grid can give the chip its own
// fixed-width column — independent of whether a third (toolbar) column
// is present.
const SectionHeader = ({ intl, title, hint, chipLabel, onOpenNav }) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.titleGroup}>
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
            {title}
          </Typography>
          {hint && (
            <Typography variant="body2" className={classes.hint}>
              {hint}
            </Typography>
          )}
        </div>
      </div>
      {chipLabel && <TonalChip className={classes.chip} label={chipLabel} />}
    </>
  );
};

SectionHeader.propTypes = {
  intl: intlShape.isRequired,
  title: PropTypes.node.isRequired,
  hint: PropTypes.node,
  chipLabel: PropTypes.node,
  onOpenNav: PropTypes.func
};

export default injectIntl(SectionHeader);
