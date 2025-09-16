import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import '../NavigationButtons/NavigationButtons.css';

const BOTTOM_OFFSET = 7;
const TOP_OFFSET = 5;

const ScrollButtons = props => {
  const [isScrollTop, setScrollTop] = useState(false);
  const [isScrollDown, setScrollDown] = useState(false);
  // State to track if the board is large and scroll should be disabled
  const [isScrollDisabled, setScrollDisabled] = useState(false);

  useEffect(
    () => {
      const bc = props.boardContainer.current;
      // Exit early if the container isn't available yet
      if (!bc) {
        return;
      }

      const checkScrollState = () => {
        // Check if scrolled to the top or bottom
        const scrollTop = bc.scrollTop <= TOP_OFFSET;
        const scrollDown =
          Math.round(bc.scrollHeight - bc.scrollTop - bc.clientHeight) - BOTTOM_OFFSET <= 0; // prettier-ignore
        setScrollTop(scrollTop);
        setScrollDown(scrollDown);

        // Check if the board's content is taller than the viewport to disable buttons
        const isLargeBoard = bc.scrollHeight > window.innerHeight;
        setScrollDisabled(isLargeBoard);
      };

      // Use a timeout to run the initial check after the layout is stable
      const timerId = setTimeout(checkScrollState, 1);
      
      // Add event listeners to update the state dynamically
      bc.addEventListener('scroll', checkScrollState);
      window.addEventListener('resize', checkScrollState); // Also check on window resize

      // Cleanup function to remove listeners
      return () => {
        clearTimeout(timerId);
        // Correctly remove the named function listener
        bc.removeEventListener('scroll', checkScrollState);
        window.removeEventListener('resize', checkScrollState);
      };
    },
    // Rerun effect if these props change, as they can affect the board's dimensions
    [props.boardContainer, props.boardId, props.totalRows]
  );

  useEffect(
    () => {
      const boardContainer = props.boardContainer.current;
      if (!boardContainer) return;

      if (isScrollTop) {
        boardContainer.scrollBy(0, -TOP_OFFSET);
        return;
      }
      if (isScrollDown) {
        boardContainer.scrollBy(0, BOTTOM_OFFSET);
      }
    },
    [isScrollDown, isScrollTop, props.boardContainer]
  );

  const boardContainer = props.boardContainer.current;

  const step = () => {
    if (!boardContainer) return 0;
    const isFixedBoard = boardContainer.className.includes('Grid_root');
    const stepValue = boardContainer.scrollHeight / props.totalRows;
    return isScrollDown && !isScrollTop && !isFixedBoard ? stepValue - 7 : stepValue;
  };
  
  // Wrapper for the scroll action that respects the disabled state
  const scroll = stepValue => {
    if (isScrollDisabled || !boardContainer) return;
    boardContainer.scrollBy(0, stepValue);
  };

  const scrollUp = () => {
    scroll(-step());
  };

  const scrollDown = () => {
    scroll(step());
  };

  if (!props.active) {
    return null;
  }

  // Add `isScrollDisabled` to the conditions for applying the 'disable' class
  const classScrollUp = props.isNavigationButtonsOnTheSide
    ? `SideNavigationButton SideButtonScrollUp ${
        !props.isScroll || props.isSaving || isScrollTop || isScrollDisabled ? 'disable' : ''
      }`
    : `NavigationButton top`;

  const classScrollDown = props.isNavigationButtonsOnTheSide
    ? `SideNavigationButton SideButtonScrollDown ${
        !props.isScroll || props.isSaving || isScrollDown || isScrollDisabled ? 'disable' : ''
      }`
    : 'NavigationButton bottom';

  return (
    <React.Fragment>
      <div
        className={
          props.isNavigationButtonsOnTheSide
            ? `SideNavigationButtonsContainer ScrollButtons`
            : ''
        }
      >
        {(!isScrollTop || props.isNavigationButtonsOnTheSide) && (
          <div className={classScrollUp}>
            <button onClick={scrollUp}>
              <KeyboardArrowUpIcon />
            </button>
          </div>
        )}
        {(!isScrollDown || props.isNavigationButtonsOnTheSide) && (
          <div className={classScrollDown}>
            <button onClick={scrollDown}>
              <KeyboardArrowDownIcon />
            </button>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

// Corrected from .props to .propTypes
ScrollButtons.propTypes = {
  active: PropTypes.bool,
  isSaving: PropTypes.bool,
  boardContainer: PropTypes.object,
  totalRows: PropTypes.number,
  boardId: PropTypes.number,
  isScroll: PropTypes.bool,
  isNavigationButtonsOnTheSide: PropTypes.bool
};

export default ScrollButtons;