import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';

import BoardDetails from './BoardDetails';
import { softRadius } from './dashboardStyles';
import messages from '../CommunicatorDialog.messages';

const PANEL_WIDTH = 300;

const useStyles = makeStyles(theme => ({
  panel: {
    position: 'sticky',
    top: theme.spacing(2),
    alignSelf: 'flex-start',
    width: PANEL_WIDTH,
    flexShrink: 0,
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
    borderRadius: softRadius(theme),
    maxHeight: `calc(100% - ${theme.spacing(2)}px)`,
    overflowY: 'auto'
  },
  sheet: {
    borderTopLeftRadius: softRadius(theme),
    borderTopRightRadius: softRadius(theme),
    maxHeight: '80vh',
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none !important'
    }
  }
}));

/**
 * Chooses how the details for the selected board are presented:
 * a sticky column beside the list on wide viewports, a bottom sheet on
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
  // top of the list.
  useEffect(
    () => {
      if (board && headingRef.current) {
        headingRef.current.focus();
      }
    },
    [board]
  );

  const handleKeyDown = event => {
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
        {details}
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
      {details}
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
