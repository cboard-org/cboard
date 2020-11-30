import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDrop } from 'react-dnd';

import styles from './DroppableCell.module.css';

function DroppableCell(props) {
  const { accept, className, onDrop, ...other } = props;

  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const isActive = isOver && canDrop;

  const cellClassName = classNames(styles.root, className, {
    [styles.isActive]: isActive
  });

  return <div {...other} className={cellClassName} ref={drop} />;
}

DroppableCell.propTypes = {
  /**
   * This drop target will only react to the items produced by the drag sources of the specified type or types.
   *
   * https://react-dnd.github.io/react-dnd/docs/api/use-drop
   */
  accept: PropTypes.string.isRequired,
  /**
   * Callback, fired when item is dropped.
   */
  onDrop: PropTypes.func.isRequired
};

export default DroppableCell;
