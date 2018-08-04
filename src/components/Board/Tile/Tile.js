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
  icon: PropTypes.node,
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
    icon,
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
      {icon && <div className="Tile__icon-placeholder">{icon}</div>}
      {children}
    </button>
  );
};

Tile.propTypes = propTypes;
Tile.defaultProps = defaultProps;

export default Tile;
