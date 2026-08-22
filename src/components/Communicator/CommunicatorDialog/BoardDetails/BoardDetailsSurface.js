import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { alpha, makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import BoardDetails from './BoardDetails';
import { softRadius } from '../CommunicatorDialog.styles';
import messages from '../CommunicatorDialog.messages';

const PANEL_WIDTH = 380;

const useStyles = makeStyles((theme) => ({
  // Same anatomy as the sheet: the rounded card clips its content and only the
  // body scrolls, so the scrollbar starts below the corner radius instead of
  // being squared off against it.
  panel: {
    alignSelf: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    width: PANEL_WIDTH,
    flexShrink: 0,
    margin: theme.spacing(2),
    borderRadius: softRadius(theme),
    maxHeight: `calc(100% - ${theme.spacing(4)}px)`,
    overflow: 'hidden'
  },
  panelHeader: {
    flexShrink: 0,
    height: theme.spacing(1)
  },
  panelBody: {
    flex: 1,
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
 * Chooses how the details for the selected board are presented:
 * a self-scrolling column beside the list on wide viewports, a bottom sheet on
 * phones so the board list never gets pushed off screen.
 */
const BoardDetailsSurface = ({
  intl,
  board,
  actions,
  busy,
  communicator,
  activeBoardId,
  onClose
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down('sm'));
  const headingRef = useRef(null);

  // Explicit activation: once a board is chosen, focus moves into the details
  // so keyboard and screen reader users land on the actions, not back at the
  // top of the list. Keyed on the id so a re-fetched board object does not
  // steal focus back from the control the user just used.
  const selectedBoardId = board && board.id;
  useEffect(() => {
    if (selectedBoardId && headingRef.current) {
      headingRef.current.focus();
    }
  }, [selectedBoardId]);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  const details = (
    <BoardDetails
      intl={intl}
      board={board}
      actions={actions}
      busy={busy}
      communicator={communicator}
      activeBoardId={activeBoardId}
      headingRef={headingRef}
    />
  );

  if (isNarrow) {
    return (
      <Drawer
        anchor="bottom"
        open={!!board}
        onClose={onClose}
        classes={{ paper: classes.sheet }}
        aria-label={intl.formatMessage(messages.boardDetails)}
      >
        <div className={classes.sheetHeader}>
          <span className={classes.handle} />
          <IconButton
            size="small"
            data-testid="close-board-details"
            className={classes.closeButton}
            aria-label={intl.formatMessage(messages.closeDetails)}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className={classes.sheetBody}>{details}</div>
      </Drawer>
    );
  }

  return (
    <Paper
      variant="outlined"
      component="aside"
      data-testid="board-details-panel"
      className={classes.panel}
      aria-label={intl.formatMessage(messages.boardDetails)}
      onKeyDown={handleKeyDown}
    >
      <div className={classes.panelHeader} />
      <div className={classes.panelBody}>{details}</div>
    </Paper>
  );
};

BoardDetailsSurface.defaultProps = {
  actions: [],
  busy: false
};

BoardDetailsSurface.propTypes = {
  intl: intlShape.isRequired,
  board: PropTypes.object,
  actions: PropTypes.array,
  busy: PropTypes.bool,
  communicator: PropTypes.object,
  activeBoardId: PropTypes.string,
  onClose: PropTypes.func.isRequired
};

export default BoardDetailsSurface;
