import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import '../NavigationButtons/NavigationButtons.css';

const ScrollButtons = props => {
  const [isScrollTop, setScrollTop] = useState(false);
  const [isScrollDown, setScrollDown] = useState(false);

  useEffect(
    () => {
      const bc = props.boardContainer.current;
      const checkScrollLimits = event => {
        const scrollTop = bc.scrollTop === 0;
        const scrollDown =
          Math.round(bc.scrollHeight - bc.scrollTop - bc.clientHeight) - 1 <= 0;
        setScrollTop(scrollTop);
        setScrollDown(scrollDown);
      };

      setTimeout(() => {
        checkScrollLimits();
      }, 1);
      bc.addEventListener('scroll', checkScrollLimits);

      return () => {
        bc.removeEventListener('scroll', () => {});
      };
    },
    [props.boardId, props.boardContainer, props.totalRows]
  );

  const boardContainer = props.boardContainer.current;

  const step = () => {
    return boardContainer.scrollHeight / props.totalRows;
  };

  const scrollUp = event => {
    scroll(-step());
  };

  const scrollDown = event => {
    scroll(step());
  };

  const scroll = step => {
    boardContainer.scrollBy(0, step);
  };

  if (!props.active) {
    return null;
  }

  return (
    <React.Fragment>
      {!isScrollTop && (
        <div
          className={`NavigationButton top ${
            !props.isLocked ? 'moveDown' : ''
          }`}
        >
          <button onClick={scrollUp}>
            <KeyboardArrowUpIcon />
          </button>
        </div>
      )}
      {!isScrollDown && (
        <div className="NavigationButton bottom">
          <button onClick={scrollDown}>
            <KeyboardArrowDownIcon />
          </button>
        </div>
      )}
    </React.Fragment>
  );
};

ScrollButtons.props = {
  active: PropTypes.bool,
  isLocked: PropTypes.bool,
  boardContainer: PropTypes.object,
  totalRows: PropTypes.number,
  boardId: PropTypes.number
};

export default ScrollButtons;
