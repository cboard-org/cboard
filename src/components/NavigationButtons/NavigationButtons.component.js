import React from 'react';
import PropTypes from 'prop-types';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import FirstPageIcon from '@material-ui/icons/FirstPage';

import './NavigationButtons.css';

const NavigationButtons = ({
  active,
  navHistory,
  previousBoard,
  toRootBoard
}) => {
  if (!active) {
    return null;
  }

  return (
    <React.Fragment>
      {navHistory.length > 2 && (
        <div className="NavigationButton left">
          <button onClick={toRootBoard}>
            <FirstPageIcon />
          </button>
        </div>
      )}
      {navHistory.length > 1 && (
        <div className="NavigationButton right">
          <button onClick={previousBoard}>
            <ChevronLeftIcon />
          </button>
        </div>
      )}
    </React.Fragment>
  );
};

NavigationButtons.props = {
  navHistory: PropTypes.arrayOf(PropTypes.string),
  previousBoard: PropTypes.func,
  toRootBoard: PropTypes.func
};

export default NavigationButtons;
