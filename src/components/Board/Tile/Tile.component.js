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
  variant: PropTypes.oneOf(['tile', 'folder'])
};

const defaultProps = {};

function Tile(props) {
  const {
    backgroundColor,
    children,
    className: classNameProp,
    variant,
    ...other
  } = props;

  const folder = variant === 'folder';
  const className = classNames('Tile', classNameProp, backgroundColor, {
    'Tile--folder': folder
  });

  return (
    <button className={className} type="button" {...other}>
      {children}
    </button>
  );
}

Tile.propTypes = propTypes;
Tile.defaultProps = defaultProps;

export default Tile;
