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
  isSaving,
  isNavigationButtonsOnTheSide
}) => {
  if (!active) {
    return null;
  }
  const classPreviousBoardButton = isNavigationButtonsOnTheSide
    ? `SideNavigationButton SideButtonPreviousBoard ${
        !isSaving && navHistory.length > 1 ? '' : 'disable'
      }`
    : `NavigationButton right`;

  const classToRootBoardButton = isNavigationButtonsOnTheSide
    ? `SideNavigationButton SideButtonToRootBoard ${
        !isSaving && navHistory.length > 2 ? '' : 'disable'
      }`
    : 'NavigationButton left';

  return (
    <React.Fragment>
      <div
        className={
          isNavigationButtonsOnTheSide ? `SideNavigationButtonsContainer` : ''
        }
      >
        {(navHistory.length > 2 || isNavigationButtonsOnTheSide) && (
          <div className={classToRootBoardButton}>
            <button onClick={toRootBoard}>
              <FirstPageIcon />
            </button>
          </div>
        )}
        {(navHistory.length > 1 || isNavigationButtonsOnTheSide) && (
          <div className={classPreviousBoardButton}>
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
  isSaving: PropTypes.bool,
  isNavigationButtonsOnTheSide: PropTypes.bool
};

export default NavigationButtons;
