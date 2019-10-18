import React from 'react';
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
   * @ignore
   */
  className: PropTypes.string,
  /**
   * Type of tile
   */
  variant: PropTypes.oneOf(['button', 'folder', 'board'])
};

const defaultProps = {};

const Tile = props => {
  const {
    backgroundColor,
    borderColor,
    children,
    className: classNameProp,
    variant,
    ...other
  } = props;

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

  const onSelect = (event, scannable, scanner) => {
    if (folder) {
      scanner.reset();
    }
  };

  return (
    <Scannable onSelect={onSelect} id={'scannable'}>
      <button className={className} type="button" {...other}>
        <div className={tileShapeClassName} style={tileShapeStyles} />
        {children}
      </button>
    </Scannable>
  );
};

Tile.propTypes = propTypes;
Tile.defaultProps = defaultProps;

export default Tile;
