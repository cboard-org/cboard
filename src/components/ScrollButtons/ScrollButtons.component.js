import React from 'react';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import '../NavigationButtons/NavigationButtons.css';

export const ScrollButtons = props => {
  const scrollUp = event => {
    start(-20, event);
  };

  const scrollDown = event => {
    start(20, event);
  };

  let interval;
  const start = (step, event) => {
    if (!props.boardContainer?.current) return;

    setEventListener(event);

    const scroll = () => {
      const boardContainer = props.boardContainer.current;
      boardContainer.scrollBy({
        top: step,
        behavior: 'smooth'
      });
    };

    interval = setInterval(function() {
      scroll();
    }, 50);
  };

  const end = () => {
    clearInterval(interval);
  };

  const setEventListener = event => {
    const type = event.type === 'mousedown' ? 'mouseup' : 'touchend';
    return window.addEventListener(type, () => {
      end();
      window.removeEventListener(type, () => {});
    });
  };

  if (!props.active) {
    return null;
  }

  return (
    <React.Fragment>
      {
        <div
          className={`NavigationButton top ${
            !props.isLocked ? 'moveDown' : ''
          }`}
        >
          <button onMouseDown={scrollUp} onTouchStart={scrollUp}>
            <KeyboardArrowUpIcon />
          </button>
        </div>
      }
      {
        <div className="NavigationButton bottom">
          <button onMouseDown={scrollDown} onTouchStart={scrollDown}>
            <KeyboardArrowDownIcon />
          </button>
        </div>
      }
    </React.Fragment>
  );
};

ScrollButtons.props = {
  active: PropTypes.bool,
  isLocked: PropTypes.bool,
  boardContainer: PropTypes.object
};
