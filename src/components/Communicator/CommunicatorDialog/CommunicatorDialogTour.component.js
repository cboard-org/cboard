import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import Joyride, { STATUS } from 'react-joyride';

import { SECTIONS, SECTION_TOUR_FLAGS } from './CommunicatorDialog.constants';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import QueueIcon from '@material-ui/icons/Queue';
import InfoIcon from '@material-ui/icons/Info';
import HomeIcon from '@material-ui/icons/Home';
import StarIcon from '@material-ui/icons/Star';
import PublicIcon from '@material-ui/icons/Public';
import KeyIcon from '@material-ui/icons/VpnKey';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import DeleteIcon from '@material-ui/icons/Delete';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import './CommunicatorDialog.css';
import messages from './CommunicatorDialog.messages';

const propTypes = {
  communicatorTour: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired,
  ready: PropTypes.bool,
  disableTour: PropTypes.func.isRequired,
  intl: intlShape.isRequired
};

const joyrideStyles = {
  options: {
    arrowColor: '#eee',
    backgroundColor: '#eee',
    primaryColor: '#aa00ff',
    textColor: '#333',
    width: 500,
    zIndex: 10000
  }
};

const intro = (title, body) => ({
  target: 'body',
  placement: 'center',
  hideCloseButton: true,
  content: (
    <div>
      <h2>
        <FormattedMessage {...title} />
      </h2>
      <h5>
        <FormattedMessage {...body} />
      </h5>
    </div>
  )
});

const legend = (intl, title, items, className) => (
  <div className={`CommunicatorDialog__Tour ${className || ''}`}>
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
    >
      <Grid item xs={12} md={12}>
        <Typography variant="h6">
          <FormattedMessage {...title} />
        </Typography>
        <List>
          {items.map(({ key, icon, label }) => (
            <ListItem key={key}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={intl.formatMessage(label)} />
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  </div>
);

// Steps are built lazily: `messages` is not resolvable at module-eval time
// under the react-intl mock the tests install.
const searchStep = () => ({
  hideCloseButton: true,
  // The header never scrolls out of view, so there is nothing to scroll to.
  disableScrolling: true,
  target: '#CommunicatorDialog__search',
  content: <FormattedMessage {...messages.walkthroughSearch} />
});

const statusIconsStep = (intl) => ({
  hideCloseButton: true,
  disableScrolling: true,
  target: '[name="CommunicatorDialog__PropertyOption"]',
  content: legend(
    intl,
    messages.walkthroughBoardProperties,
    [
      { key: 'public', icon: <PublicIcon />, label: messages.publicBoard },
      { key: 'private', icon: <KeyIcon />, label: messages.privateBoard },
      { key: 'root', icon: <HomeIcon />, label: messages.rootBoard },
      { key: 'active', icon: <RemoveRedEyeIcon />, label: messages.activeBoard }
    ],
    'CommunicatorDialog__Tour__boardProperty'
  )
});

const detailsStep = (intl, items) => ({
  hideCloseButton: true,
  target: '[data-testid="board-details-panel"]',
  placement: 'left',
  content: legend(intl, messages.walkthroughBoardActionButton, items)
});

// One tour per dashboard section, each targeting only what its own section
// renders: search and status icons in the board sections, the tray in quick
// access. Nothing points at the sidebar, so no tour spans sections.
const SECTION_STEPS = {
  [SECTIONS.MY_BOARDS]: (intl) => [
    intro(
      messages.walkthroughCommunicatorTitle,
      messages.walkthroughCommunicator
    ),
    searchStep(),
    statusIconsStep(intl),
    detailsStep(intl, [
      {
        key: 'remove',
        icon: <StarIcon />,
        label: messages.walkthroughAllMyBoardsRemoveBoard
      },
      {
        key: 'add',
        icon: <StarBorderIcon />,
        label: messages.walkthroughAllMyBoardsAddBoard
      },
      {
        key: 'unpublish',
        icon: <KeyIcon />,
        label: messages.walkthroughAllMyBoardsUnpublishBoard
      },
      {
        key: 'publish',
        icon: <HomeIcon />,
        label: messages.walkthroughAllMyBoardsPublishBoard
      },
      {
        key: 'delete',
        icon: <DeleteIcon />,
        label: messages.walkthroughAllMyBoardsDeleteBoard
      }
    ])
  ],
  [SECTIONS.MY_COMMUNICATOR]: (intl) => [
    intro(messages.sectionQuickAccess, messages.sectionQuickAccessHint),
    {
      hideCloseButton: true,
      disableScrolling: true,
      target: '[data-testid="quick-access-row"]',
      placement: 'bottom',
      content: legend(intl, messages.walkthroughBoardActionButton, [
        {
          key: 'remove',
          icon: <StarIcon />,
          label: messages.walkthroughBoardActionsRemove
        },
        {
          key: 'root',
          icon: <HomeIcon />,
          label: messages.walkthroughBoardActionsSetBoardAsRoot
        }
      ])
    }
  ],
  [SECTIONS.COMMUNITY]: (intl) => [
    intro(messages.allBoards, messages.walkthroughPublicBoards),
    searchStep(),
    detailsStep(intl, [
      {
        key: 'copy',
        icon: <QueueIcon />,
        label: messages.walkthroughPublicBoardsCopy
      },
      {
        key: 'detail',
        icon: <InfoIcon />,
        label: messages.walkthroughPublicBoardsDetail
      }
    ])
  ]
};

// A step whose target is missing or hidden — a status icon a board happens not
// to have, the details panel on a phone, the sidebar behind the mobile drawer —
// leaves Joyride on an unplaceable tooltip, so drop those before starting.
const isTargetVisible = (target) => {
  if (target === 'body') {
    return true;
  }
  const element = document.querySelector(target);
  return !!element && element.offsetParent !== null;
};

function CommunicatorDialogTour({
  communicatorTour,
  section,
  ready,
  disableTour,
  intl
}) {
  const flag = SECTION_TOUR_FLAGS[section];
  const enabled = !!flag && !!communicatorTour[flag] && ready;
  const [steps, setSteps] = useState([]);

  // Targets are resolved once the section has painted its boards: measuring
  // while the list is still loading would drop every step but the intro.
  useEffect(() => {
    if (!enabled) {
      setSteps([]);
      return;
    }
    setSteps(
      SECTION_STEPS[section](intl).filter((step) =>
        isTargetVisible(step.target)
      )
    );
  }, [enabled, section, intl]);

  if (!enabled || !steps.length) {
    return null;
  }

  return (
    <Joyride
      key={section}
      callback={({ status }) => {
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
          disableTour({
            communicatorTour: { ...communicatorTour, [flag]: false }
          });
        }
      }}
      steps={steps}
      continuous={true}
      /* Joyride's scroll-parent "fix" rewrites a non-scrolling parent's
         overflow to `initial`, which un-clips the dialog container and gives
         the page a scrollbar it should not have. Every remaining target
         measures correctly without it: their offset parent is the fixed
         full-screen dialog, so offsetTop is already a viewport coordinate. */
      disableScrollParentFix={true}
      showSkipButton={true}
      showProgress={false}
      disableOverlayClose={true}
      run={enabled}
      styles={joyrideStyles}
      locale={{
        last: intl.formatMessage(messages.walkthroughEndTour),
        skip: intl.formatMessage(messages.walkthroughCloseTour),
        next: intl.formatMessage(messages.walkthroughNext),
        back: intl.formatMessage(messages.walkthroughBack)
      }}
    />
  );
}

CommunicatorDialogTour.defaultProps = {
  ready: true
};

CommunicatorDialogTour.propTypes = propTypes;

export default CommunicatorDialogTour;
