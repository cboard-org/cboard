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

  useEffect(
    () => {
      const bc = props.boardContainer.current;
      const checkScrollLimits = event => {
        const scrollTop = bc.scrollTop <= TOP_OFFSET;
        const scrollDown =
          Math.round(bc.scrollHeight - bc.scrollTop - bc.clientHeight) - BOTTOM_OFFSET <= 0; // prettier-ignore
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

  useEffect(
    () => {
      const boardContainer = props.boardContainer.current;
      if (isScrollTop) {
        boardContainer.scrollBy(0, -TOP_OFFSET);
        return;
      }
      if (isScrollDown) boardContainer.scrollBy(0, BOTTOM_OFFSET);
    },
    [isScrollDown, isScrollTop, props.boardContainer]
  );

  const boardContainer = props.boardContainer.current;

  const step = () => {
    const isFixedBoard = boardContainer.className.includes('Grid_root');
    const step = boardContainer.scrollHeight / props.totalRows;
    return isScrollDown && !isScrollTop && !isFixedBoard ? step - 7 : step;
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

  const classScrollUp = props.isNavigationButtonsOnTheSide
    ? `SideNavigationButton SideButtonScrollUp ${
        !props.isScroll || isScrollTop ? 'disable' : ''
      }`
    : `NavigationButton top ${!props.isLocked ? 'moveDown' : ''}`;

  const classScrollDown = props.isNavigationButtonsOnTheSide
    ? `SideNavigationButton SideButtonScrollDown ${
        !props.isScroll || isScrollDown ? 'disable' : ''
      }`
    : 'NavigationButton bottom';

  return (
    <React.Fragment>
      <div
        className={
          props.isNavigationButtonsOnTheSide
            ? `SideNavigationButtonsContainer ScrollButtons ${
                !props.isLocked ? 'moveDown' : ''
              }`
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

ScrollButtons.props = {
  active: PropTypes.bool,
  isLocked: PropTypes.bool,
  boardContainer: PropTypes.object,
  totalRows: PropTypes.number,
  boardId: PropTypes.number,
  isScroll: PropTypes.bool,
  isNavigationButtonsOnTheSide: PropTypes.bool
};

export default ScrollButtons;
