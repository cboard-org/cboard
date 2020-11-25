import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDrag } from 'react-dnd';

import styles from './DraggableItem.module.css';

function DraggableItem(props) {
  const { className, disabled, id, style, type, ...other } = props;

  const [{ opacity }, drag] = useDrag({
    item: { id, type },
    canDrag: () => !disabled,
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.4 : 1
    })
  });

  const cellStyle = { ...style, opacity };
  const cellClassName = classNames(styles.root, className);

  return (
    <div {...other} className={cellClassName} style={cellStyle} ref={drag} />
  );
}

DraggableItem.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string,
  type: PropTypes.string
};

export default DraggableItem;
