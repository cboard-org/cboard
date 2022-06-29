import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import GridBase from './GridBase';
import styles from './Grid.module.css';

function chunks(array, size) {
  const newArray = [...array];
  const results = [];

  while (newArray.length) {
    results.push(newArray.splice(0, size));
  }

  return results;
}

const focusPosition = {
  x: 0,
  y: 0
};
function Grid(props) {
  const { className, items, style, ...other } = props;

  const itemsPerPage = other.rows * other.columns;
  const pages = chunks(items, itemsPerPage);

  const gridClassName = classNames(styles.grid, className);

  const findPressedArrow = event => {
    const code = event.code;
    const right = code === 'ArrowRight';
    const left = code === 'ArrowLeft';
    const up = code === 'ArrowUp';
    const down = code === 'ArrowDown';

    if (!(right || left || up || down)) return null;
    event.preventDefault();
    if (event.repeat) return null;
    return { right, left, up, down };
  };

  const setFocusPositionFromFocusedButton = buttonElement => {
    const setFocusPositionFromId = id => {
      const divider = '-';
      const positionArrayXY = id.split(divider);
      const xPosition = parseInt(positionArrayXY[0]);
      const yPosition = parseInt(positionArrayXY[1]);
      focusPosition.x = xPosition;
      focusPosition.y = yPosition;
    };
    if (buttonElement) {
      const activeDraggableItem = buttonElement.parentNode;
      const activeDroppableCellId = activeDraggableItem?.parentNode?.id;
      if (activeDroppableCellId) setFocusPositionFromId(activeDroppableCellId);
    }
  };

  const handleOnKeyDown = event => {
    const keycode = event.code;

    const manageArrows = event => {
      const setFocusPosition = pressedArrow => {
        const { columns, rows } = other;
        const totalRows = pages.length * rows;
        const { right, left, up, down } = pressedArrow;
        const rightLimit = focusPosition.x >= columns - 1;
        const leftLimit = focusPosition.x <= 0;
        const topLimit = focusPosition.y <= 0;
        const bottomLimit = focusPosition.y >= totalRows - 1;
        if (right) {
          if (rightLimit) {
            focusPosition.x = 0;
            return;
          }
          focusPosition.x = focusPosition.x + 1;
          return;
        }
        if (left) {
          if (leftLimit) {
            focusPosition.x = columns - 1;
            return;
          }
          focusPosition.x = focusPosition.x - 1;
          return;
        }
        if (up) {
          if (topLimit) {
            focusPosition.y = totalRows - 1;
            return;
          }
          focusPosition.y = focusPosition.y - 1;
          return;
        }
        if (down) {
          if (bottomLimit) {
            focusPosition.y = 0;
            return;
          }
          focusPosition.y = focusPosition.y + 1;
          return;
        }
      };

      const pressedArrow = findPressedArrow(event);
      if (!pressedArrow) return;
      setFocusPosition(pressedArrow);

      const currentId = `${focusPosition.x}-${focusPosition.y}`;
      const currentTile = document.getElementById(currentId);

      if (currentTile) {
        const isAvailableTile = () => {
          if (currentTile?.firstChild) {
            currentTile.firstChild.querySelector('button').focus();
            return true;
          }
          return false;
        };

        if (isAvailableTile()) return;
      }
      manageArrows({
        code: keycode,
        preventDefault: event.preventDefault,
        repeat: false
      });
    };

    const manageTabs = () => {
      const tabIsPressed = () => {
        const tab = keycode === 'Tab';
        if (tab) return true;
        return false;
      };
      if (tabIsPressed()) {
        const awaitTabSetNewFocus = () => {
          const refreshFocusPosition = () => {
            const activeButtonElement = document.activeElement;
            setFocusPositionFromFocusedButton(activeButtonElement);
          };
          setTimeout(refreshFocusPosition, 0);
        };
        awaitTabSetNewFocus();
      }
    };

    manageArrows(event);
    manageTabs();
  };

  useEffect(() => {
    const manageKeyDown = event => {
      if (findPressedArrow(event)) {
        const focusIsNotOnTile = () => {
          const activeElement = document.activeElement;
          const activeElementChildsArray = Array.from(
            activeElement?.childNodes
          );
          if (
            activeElementChildsArray.find(
              element => element.className === 'Symbol'
            )
          )
            return false;
          return true;
        };

        if (focusIsNotOnTile()) {
          const focusFirstTile = () => {
            const firstTile = document.getElementsByClassName('Tile')[0];
            if (!firstTile) return;
            firstTile.focus();
            setFocusPositionFromFocusedButton(firstTile);
          };

          focusFirstTile();
        }
      }
    };

    window.addEventListener('keydown', manageKeyDown);

    return () => {
      window.removeEventListener('keydown', manageKeyDown);
    };
  }, []);

  return (
    <div className={styles.root} style={style} onKeyDown={handleOnKeyDown}>
      {pages.length > 0 ? (
        pages.map((pageItems, i) => (
          <GridBase
            {...other}
            className={gridClassName}
            items={pageItems}
            key={i}
            page={i}
          />
        ))
      ) : (
        <GridBase {...other} className={gridClassName} page={0} />
      )}
    </div>
  );
}

Grid.propTypes = {
  /**
   * Number of columns.
   */
  columns: PropTypes.number.isRequired,
  /**
   * If `true`, items can be dragged and dropped.
   */
  dragAndDropEnabled: PropTypes.bool,
  /**
   * Items to render.
   */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * Item ID.
       */
      id: PropTypes.string.isRequired
    })
  ),
  onItemDrop: PropTypes.func,
  /**
   * Items order by ID.
   */
  order: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  /**
   * Item empty cell.
   */
  renderEmptyCell: PropTypes.func,
  /**
   * Item renderer.
   */
  renderItem: PropTypes.func.isRequired,
  /**
   * Number of rows.
   */
  rows: PropTypes.number.isRequired
};

export default Grid;
