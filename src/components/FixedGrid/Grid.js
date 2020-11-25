import React from 'react';
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

function Grid(props) {
  const { className, items, style, ...other } = props;

  const itemsPerPage = other.rows * other.columns;
  const pages = chunks(items, itemsPerPage);

  const gridClassName = classNames(styles.grid, className);

  return (
    <div className={styles.root} style={style}>
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
