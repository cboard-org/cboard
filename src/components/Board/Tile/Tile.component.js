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

  const styles = {};

  if (borderColor) {
    styles.borderColor = borderColor;
  }

  if (backgroundColor) {
    styles.backgroundColor = backgroundColor;
  }

  const beforeClassName = classNames({
    'Tile--folder--before': folder,
    'Tile--before': !folder
  });

  return (
    <button className={className} type="button" {...other}>
      <div className={beforeClassName} style={styles} />
      {children}
      {folder && <div className="Tile--folder--after" style={styles} />}
    </button>
  );
};

Tile.propTypes = propTypes;
Tile.defaultProps = defaultProps;

export default Tile;
