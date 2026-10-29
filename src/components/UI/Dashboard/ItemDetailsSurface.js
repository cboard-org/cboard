import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { alpha, makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import ItemDetails from './ItemDetails';
import { softRadius } from './Dashboard.styles';
import messages from './Dashboard.messages';

const PANEL_WIDTH = 380;

const useStyles = makeStyles((theme) => ({
  // Flush full-height rail rather than a floating card: only the inner edge is
  // drawn, so the panel reads as part of the dashboard chrome, and just the
  // body scrolls.
  panel: {
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    width: PANEL_WIDTH,
    flexShrink: 0,
    height: '100%',
    borderWidth: 0,
    borderLeftWidth: 1,
    borderRadius: 0,
    backgroundColor: theme.palette.background.default,
    overflow: 'hidden'
  },
  panelHeader: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    minHeight: 48,
    padding: theme.spacing(0, 0.5, 0, 2),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  panelTitle: {
    flex: 1,
    minWidth: 0,
    fontWeight: 550,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    outline: 'none'
  },
  panelBody: {
    flex: 1,
    paddingBottom: theme.spacing(1),
    minHeight: 0,
    overflowY: 'auto',
    overscrollBehavior: 'contain'
  },
  sheet: {
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: softRadius(theme),
    borderTopRightRadius: softRadius(theme),
    maxHeight: '70vh',
    overflow: 'hidden',
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none !important'
    }
  },
  sheetHeader: {
    position: 'relative',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    padding: theme.spacing(0, 1)
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: alpha(theme.palette.text.primary, 0.2)
  },
  closeButton: {
    position: 'absolute',
    top: '50%',
    right: theme.spacing(0.5),
    transform: 'translateY(-50%)',
    color: theme.palette.text.secondary
  },
  sheetBody: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    WebkitOverflowScrolling: 'touch'
  }
}));

/**
 * Chooses how the details for the selected item are presented:
 * a self-scrolling column beside the list on wide viewports, a bottom sheet on
 * phones so the item list never gets pushed off screen.
 */
const ItemDetailsSurface = ({
  intl,
  selectedKey,
  label,
  emptyMessage,
  title,
  meta,
  chips,
  thumb,
  actions,
  busy,
  onClose
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down('sm'));
  const headingRef = useRef(null);
  const open = !!selectedKey;

  // Explicit activation: once an item is chosen, focus moves into the details
  // so keyboard and screen reader users land on the actions, not back at the
  // top of the list. Keyed on the item key so a re-fetched item does not
  // steal focus back from the control the user just used.
  useEffect(() => {
    if (selectedKey && headingRef.current) {
      headingRef.current.focus();
    }
  }, [selectedKey]);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  const details = (hideTitle) => (
    <ItemDetails
      empty={!open}
      emptyMessage={emptyMessage}
      title={title}
      meta={meta}
      chips={chips}
      thumb={thumb}
      actions={actions}
      busy={busy}
      headingRef={headingRef}
      hideTitle={hideTitle}
    />
  );

  const closeButton = (className) => (
    <IconButton
      size="small"
      data-testid="close-item-details"
      className={className}
      aria-label={intl.formatMessage(messages.closeDetails)}
      onClick={onClose}
    >
      <CloseIcon />
    </IconButton>
  );

  if (isNarrow) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        classes={{ paper: classes.sheet }}
        aria-label={label}
      >
        <div className={classes.sheetHeader}>
          <span className={classes.handle} />
          {closeButton(classes.closeButton)}
        </div>
        <div className={classes.sheetBody}>{details(false)}</div>
      </Drawer>
    );
  }

  return (
    <Paper
      variant="outlined"
      component="aside"
      data-testid="item-details-panel"
      className={classes.panel}
      aria-label={label}
      onKeyDown={handleKeyDown}
    >
      <div className={classes.panelHeader}>
        <Typography
          variant="subtitle1"
          component="h2"
          className={classes.panelTitle}
          title={open ? title : undefined}
          tabIndex={-1}
          ref={headingRef}
        >
          {open ? title : label}
        </Typography>
        {open && closeButton()}
      </div>
      <div className={classes.panelBody}>{details(true)}</div>
    </Paper>
  );
};

ItemDetailsSurface.defaultProps = {
  selectedKey: null,
  actions: [],
  busy: false
};

ItemDetailsSurface.propTypes = {
  intl: intlShape.isRequired,
  selectedKey: PropTypes.string,
  label: PropTypes.string.isRequired,
  emptyMessage: PropTypes.node,
  title: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.string),
  chips: PropTypes.node,
  thumb: PropTypes.object,
  actions: PropTypes.array,
  busy: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

export default injectIntl(ItemDetailsSurface);
