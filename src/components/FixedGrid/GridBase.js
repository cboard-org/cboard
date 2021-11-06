import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import * as utils from './utils.ts';
import Row from './Row/Row';
import DroppableCell from './DroppableCell/DroppableCell';
import DraggableItem from './DraggableItem/DraggableItem';

import AddBoxRoundedIcon from '@material-ui/icons/AddBoxRounded';

import styles from './GridBase.module.css';

function GridBase(props) {
  const {
    className,
    columns,
    dragAndDropEnabled,
    items,
    onItemDrop,
    order,
    renderEmptyCell,
    renderItem,
    rows,
    onAddTileClick,
    ...other
  } = props;

  const gridClassName = classNames(styles.root, className);

  const emptyCellClassName = classNames(styles.empty_cell);

  const grid = utils.sortGrid({ columns, rows, order, items });

  let itemIndex = 0;

  return (
    <div className={gridClassName} {...other}>
      {grid.map((row, rowIndex) => (
        <Row key={rowIndex}>
          {row.map((item, columnIndex) => {
            return (
              <DroppableCell
                key={columnIndex}
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
                  <div
                    className={emptyCellClassName}
                    label={'add tile'} //intl.formatMessage(messages.deleteTiles)}
                    onClick={() => {
                      const position = { row: rowIndex, column: columnIndex };
                      onAddTileClick(position);
                    }}
                  >
                    <AddBoxRoundedIcon color="action" fontSize="large" />
                  </div>
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
  /**
   * Items order by ID.
   */
  order: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
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
