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
  isLocked
}) => {
  if (!active) {
    return null;
  }
  const isRectangleButton = true;
  const classPreviousBoardButton = isRectangleButton
    ? `RectangleButton RectanglePreviousBoard ${
        navHistory.length > 2 ? '' : 'disable'
      }`
    : `NavigationButton left`;

  const classToRootBoardButton = isRectangleButton
    ? `RectangleButton RectangleToRootBoard ${
        navHistory.length > 1 ? '' : 'disable'
      }`
    : 'NavigationButton right';

  return (
    <React.Fragment>
      <div
        className={
          isRectangleButton
            ? `ScrollButtonsContainer Back ${!isLocked ? 'moveDown' : ''}`
            : ''
        }
      >
        {(navHistory.length > 2 || isRectangleButton) && (
          <div className={classPreviousBoardButton}>
            <button onClick={toRootBoard}>
              <FirstPageIcon />
            </button>
          </div>
        )}
        {(navHistory.length > 1 || isRectangleButton) && (
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
  isLocked: PropTypes.bool
};

export default NavigationButtons;
