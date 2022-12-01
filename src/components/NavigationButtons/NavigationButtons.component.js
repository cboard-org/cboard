import React from 'react';
import PropTypes from 'prop-types';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import FirstPageIcon from '@material-ui/icons/FirstPage';

import './NavigationButtons.css';

const NavigationButtons = ({
  active,
  navHistory,
  previousBoard,
  toRootBoard,
  isLocked,
  isNavigationButtonsOnTheSide
}) => {
  if (!active) {
    return null;
  }
  const classPreviousBoardButton = isNavigationButtonsOnTheSide
    ? `SideNavigationButton SideButtonPreviousBoard ${
        navHistory.length > 2 ? '' : 'disable'
      }`
    : `NavigationButton left`;

  const classToRootBoardButton = isNavigationButtonsOnTheSide
    ? `SideNavigationButton SideButtonToRootBoard ${
        navHistory.length > 1 ? '' : 'disable'
      }`
    : 'NavigationButton right';

  return (
    <React.Fragment>
      <div
        className={
          isNavigationButtonsOnTheSide
            ? `SideNavigationButtonsContainer ${!isLocked ? 'moveDown' : ''}`
            : ''
        }
      >
        {(navHistory.length > 2 || isNavigationButtonsOnTheSide) && (
          <div className={classPreviousBoardButton}>
            <button onClick={toRootBoard}>
              <FirstPageIcon />
            </button>
          </div>
        )}
        {(navHistory.length > 1 || isNavigationButtonsOnTheSide) && (
          <div className={classToRootBoardButton}>
            <button onClick={previousBoard}>
              <ChevronLeftIcon />
            </button>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

NavigationButtons.props = {
  navHistory: PropTypes.arrayOf(PropTypes.string),
  previousBoard: PropTypes.func,
  toRootBoard: PropTypes.func,
  isLocked: PropTypes.bool,
  isNavigationButtonsOnTheSide: PropTypes.bool
};

export default NavigationButtons;
