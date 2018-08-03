import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Tile.css';

const propTypes = {
  /**
   * Background color
   */
  backgroundColor: PropTypes.string,
  /**
   * Border color
   */
  borderColor: PropTypes.string,
  /**
   * Tile content
   */
  children: PropTypes.node,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   *
   */
  Icon: PropTypes.node,
  /**
   * Type of tile
   */
  variant: PropTypes.oneOf(['button', 'folder'])
};

const defaultProps = {};

const Tile = props => {
  const {
    backgroundColor,
    borderColor,
    children,
    className,
    Icon,
    variant,
    ...other
  } = props;

  const tileClassName = classNames('Tile', className);

  const folder = variant === 'folder';
  const tileShapeClassName = classNames('TileShape', {
    'TileShape--folder': folder
  });

  const tileShapeStyles = {};

  if (borderColor) {
    tileShapeStyles.borderColor = borderColor;
  }

  if (backgroundColor) {
    tileShapeStyles.backgroundColor = backgroundColor;
  }

  return (
    <button className={tileClassName} type="button" {...other}>
      <div className={tileShapeClassName} style={tileShapeStyles} />
      {Icon && <div className="Tile__icon-placeholder">{Icon}</div>}
      {children}
    </button>
  );
};

Tile.propTypes = propTypes;
Tile.defaultProps = defaultProps;

export default Tile;
