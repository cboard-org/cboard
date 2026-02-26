import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Scannable } from 'react-scannable';

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
   * Content of tile
   */
  children: PropTypes.node,
  /**
   *  cooldown between tile selections
   */
  tileCooldownEnabled: PropTypes.bool,
  tileCooldownMs: PropTypes.number,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * Type of tile
   */
  variant: PropTypes.oneOf(['button', 'folder', 'board']),
  /**
   * Unique id for the tile key, used for React reconciliation.
   * Should be unique among siblings.
   */
  id: PropTypes.string
};

const defaultProps = { tileCooldownEnabled: false, tileCooldownMs: 2000 };

const Tile = props => {
  const {
    backgroundColor,
    borderColor,
    children,
    className: classNameProp,
    variant,
    id,
    tileCooldownEnabled,
    tileCooldownMs,
    onClick, //  intercept
    ...other
  } = props;

  const lastSelectRef = useRef(0);

  const allowSelect = () => {
    if (!tileCooldownEnabled) return true;

    const now = Date.now();
    if (now - lastSelectRef.current < tileCooldownMs) {
      return false;
    }

    lastSelectRef.current = now;
    return true;
  };

  const handleClick = e => {
    if (!allowSelect()) return;
    onClick?.(e);
  };

  const onSelect = (event, scannable, scanner) => {
    if (!allowSelect()) return;

    if (folder) {
      scanner.reset();
    }

    // IMPORTANT: trigger the same action as click
    onClick?.(event);
  };

  const folder = variant === 'folder';
  const className = classNames('Tile', classNameProp, {
    'Tile--folder': folder
  });

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
    <Scannable onSelect={onSelect} id="scannable">
      <button
        className={className}
        type="button"
        key={id}
        onClick={handleClick}
        {...other}
      >
        <div className={tileShapeClassName} style={tileShapeStyles} />
        {children}
      </button>
    </Scannable>
  );
};

Tile.propTypes = propTypes;
Tile.defaultProps = defaultProps;

export default Tile;
