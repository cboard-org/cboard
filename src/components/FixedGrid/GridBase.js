import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import * as utils from './utils.ts';
import Row from './Row/Row';
import DroppableCell from './DroppableCell/DroppableCell';
import DraggableItem from './DraggableItem/DraggableItem';
import styles from './GridBase.module.css';
import { useMemo } from 'react';

function GridBase(props) {
  const {
    className,
    columns,
    dragAndDropEnabled,
    onItemDrop,
    renderEmptyCell,
    renderItem,
    rows,
    page,
    gridState,
    ...other
  } = props;

  const gridClassName = classNames(styles.root, className);

  const { items, order } = gridState;
  const grid = useMemo(
    () => {
      return utils.sortGrid({ columns, rows, order, items });
    },
    [columns, rows, order, items]
  );

  let itemIndex = 0;

  return (
    <div className={gridClassName} {...other}>
      {grid.map((row, rowIndex) => (
        <Row key={rowIndex}>
          {row.map((item, columnIndex) => {
            const yPosition = page * rows + rowIndex;
            const idWithPosition = `${columnIndex}-${yPosition}`;
            return (
              <DroppableCell
                key={columnIndex}
                id={idWithPosition}
                accept={'grid-item'}
                onDrop={item => {
                  const position = { row: rowIndex, column: columnIndex };

                  onItemDrop(item, position);
                }}
              >
                {item ? (
                  <DraggableItem
                    type={'grid-item'}
                    id={item.id}
                    disabled={!dragAndDropEnabled}
                  >
                    {renderItem(item, itemIndex++)}
                  </DraggableItem>
                ) : (
                  renderEmptyCell && renderEmptyCell()
                )}
              </DroppableCell>
            );
          })}
        </Row>
      ))}
    </div>
  );
}

GridBase.propTypes = {
  /**
   * Number of columns.
   */
  columns: PropTypes.number.isRequired,
  /**
   * If `true`, items can be dragged and dropped.
   */
  dragAndDropEnabled: PropTypes.bool,
  /**
   * State of the grid, including items and order.
   */
  gridState: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ),
    order: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired
  }).isRequired,
  /**
   * Item renderer.
   */
  renderItem: PropTypes.func.isRequired,
  /**
   * Number of rows.
   */
  rows: PropTypes.number.isRequired
};

GridBase.defaultProps = {
  items: [],
  order: []
};

export default GridBase;
