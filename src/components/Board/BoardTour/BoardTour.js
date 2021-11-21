import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Joyride, { STATUS } from 'react-joyride';

import messages from './../Board.messages';
import './../Board.css';

const propTypes = {
  isRootBoardTourEnabled: PropTypes.bool,
  isUnlockedTourEnabled: PropTypes.bool,
  isLocked: PropTypes.bool,
  disableTour: PropTypes.func.isRequired
};

const joyRideStyles = {
  options: {
    arrowColor: '#eee',
    backgroundColor: '#eee',
    primaryColor: '#aa00ff',
    textColor: '#333',
    width: 500,
    zIndex: 1000
  }
};

function BoardTour({
  isRootBoardTourEnabled,
  isUnlockedTourEnabled,
  isLocked,
  disableTour
}) {
  const unlockedHelpSteps = [
    {
      target: 'body',
      placement: 'center',
      hideCloseButton: true,
      content: (
        <h2>
          <FormattedMessage {...messages.walkthroughStart} />
        </h2>
      )
    },
    {
      hideCloseButton: true,
      target: '.personal__account',
      content: <FormattedMessage {...messages.walkthroughSignInUp} />
    },
    {
      hideCloseButton: true,
      target: '.edit__board__ride',
      content: <FormattedMessage {...messages.walkthroughEditBoard} />
    },
    {
      hideCloseButton: true,
      target: '.EditToolbar__BoardTitle',
      content: <FormattedMessage {...messages.walkthroughBoardName} />
    },
    {
      hideCloseButton: true,
      target: '.add__board__tile',
      content: <FormattedMessage {...messages.walkthroughAddTile} />
    },
    {
      hideCloseButton: true,
      target: '.Communicator__title',
      content: <FormattedMessage {...messages.walkthroughChangeBoard} />
    },
    {
      hideCloseButton: true,
      target: '.edit__communicator',
      content: <FormattedMessage {...messages.walkthroughBuildCommunicator} />
    }
  ];

  const lockedHelpSteps = [
    {
      target: 'body',
      placement: 'center',
      hideCloseButton: true,
      content: (
        <h2>
          <FormattedMessage {...messages.walkthroughWelcome} />
        </h2>
      )
    },
    {
      hideCloseButton: true,
      target: '.open__lock',
      content: <FormattedMessage {...messages.walkthroughUnlock} />
    }
  ];
  return (
    <div>
      {isLocked && isRootBoardTourEnabled && (
        <Joyride
          callback={data => {
            const { status } = data;
            if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
              if (isRootBoardTourEnabled) {
                disableTour({ isRootBoardTourEnabled: false });
              }
            }
          }}
          steps={lockedHelpSteps}
          continuous={true}
          showSkipButton={true}
          showProgress={true}
          disableOverlayClose={true}
          run={isRootBoardTourEnabled}
          styles={joyRideStyles}
          locale={{
            last: <FormattedMessage {...messages.walkthroughEndTour} />,
            skip: <FormattedMessage {...messages.walkthroughCloseTour} />,
            next: <FormattedMessage {...messages.walkthroughNext} />,
            back: <FormattedMessage {...messages.walkthroughBack} />
          }}
        />
      )}
      {!isLocked && isUnlockedTourEnabled && (
        <Joyride
          callback={data => {
            const { status } = data;
            if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
              if (isUnlockedTourEnabled) {
                disableTour({ isUnlockedTourEnabled: false });
              }
            }
          }}
          steps={unlockedHelpSteps}
          continuous={true}
          showSkipButton={true}
          showProgress={true}
          disableOverlayClose={true}
          run={isUnlockedTourEnabled}
          styles={joyRideStyles}
          locale={{
            last: <FormattedMessage {...messages.walkthroughEndTour} />,
            skip: <FormattedMessage {...messages.walkthroughCloseTour} />,
            next: <FormattedMessage {...messages.walkthroughNext} />,
            back: <FormattedMessage {...messages.walkthroughBack} />
          }}
        />
      )}
    </div>
  );
}

BoardTour.propTypes = propTypes;

export default BoardTour;
