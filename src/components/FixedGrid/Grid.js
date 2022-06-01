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

  const handleOnKeyUp = event => {
    const keycode = event.code;
    const { columns, rows } = other;
    if (event.repeat) return;

    const compareKeys = code => {
      const right = code === 'ArrowRight';
      const left = code === 'ArrowLeft';
      const up = code === 'ArrowUp';
      const down = code === 'ArrowDown';

      if (!(right || left || up || down)) return true;
      event.preventDefault();

      const rightLimit = focusPosition.x >= columns - 1;
      const leftLimit = focusPosition.x <= 0;
      const topLimit = focusPosition.y <= 0;
      const bottomLimit = focusPosition.y >= rows - 1;
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
          focusPosition.y = rows - 1;
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

    const isNotArrowKey = compareKeys(keycode);
    if (isNotArrowKey) return;

    const currentId = `${focusPosition.x}-${focusPosition.y}`;
    const currentTile = document.getElementById(currentId);

    if (currentTile?.firstChild)
      return currentTile.firstChild.querySelector('button').focus();
    handleOnKeyUp({
      code: keycode,
      preventDefault: event.preventDefault,
      repeat: false
    });
  };

  useEffect(() => {
    const isArrowKey = event => {
      const code = event.code;
      const right = code === 'ArrowRight';
      const left = code === 'ArrowLeft';
      const up = code === 'ArrowUp';
      const down = code === 'ArrowDown';

      if (!(right || left || up || down)) return false;
      event.preventDefault();
      return true;
    };

    const tileHasFocus = event => {
      const focusFirstTile = () => {
        const firstTile = document.getElementsByClassName('Tile')[0];
        if (!firstTile) return;
        firstTile.focus();
        const firstTilePosition = firstTile.parentNode.parentNode.id;
        focusPosition.x = parseInt(firstTilePosition[0]);
        focusPosition.y = parseInt(firstTilePosition[2]);
      };

      if (!isArrowKey(event)) return;

      if (event.repeat) return;

      const activeElement = document.activeElement;
      if (activeElement?.lastChild?.className !== 'Symbol') {
        focusFirstTile();
      }
    };

    const preventScroll = event => {
      isArrowKey(event);
    };

    window.addEventListener('keyup', tileHasFocus);
    window.addEventListener('keydown', preventScroll);

    return () => {
      window.removeEventListener('keyup', tileHasFocus);
      window.removeEventListener('keydown', preventScroll);
    };
  }, []);

  return (
    <div className={styles.root} style={style} onKeyDown={handleOnKeyUp}>
      {pages.length > 0 ? (
        pages.map((pageItems, i) => (
          <GridBase
            {...other}
            className={gridClassName}
            items={pageItems}
            key={i}
          />
        ))
      ) : (
        <GridBase {...other} className={gridClassName} />
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
