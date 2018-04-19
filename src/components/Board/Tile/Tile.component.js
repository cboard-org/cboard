import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Symbol from '../Symbol';
import './Tile.css';

class Tile extends PureComponent {
  static propTypes = {
    /**
     * @ignore
     */
    className: PropTypes.string,
    /**
     * @ignore
     */
    children: PropTypes.node,
    /**
     * Board tile ID
     */
    id: PropTypes.string,
    /**
     * Label to display
     */
    label: PropTypes.string,
    /**
     * Text to vocalize, takes precedence over label when speaking
     */
    vocalization: PropTypes.string,
    /**
     * Image source path
     */
    image: PropTypes.string,
    /**
     * Board to load on click
     */
    loadBoard: PropTypes.string,
    /**
     * Callback fired when clicking a tile
     */
    onClick: PropTypes.func,
    /**
     * Callback fired when tile is focused
     */
    onFocus: PropTypes.func,
    /**
     * Callback fired when onTouchStart occurs
     */
    onTouchStart: PropTypes.func,
    /**
     * Callback fired when onMouseDown occurs
     */
    onMouseDown: PropTypes.func,
    /**
     * If true, tile element will be focused
     */
    hasFocus: PropTypes.bool,
    /**
     * Custom tile color
     */
    color: PropTypes.string
  };

  static defaultProps = {
    color: ''
  };

  handleClick = () => {
    const {
      id,
      type,
      label,
      labelKey,
      vocalization,
      image,
      loadBoard,
      onClick
    } = this.props;
    const tile = { id, type, label, labelKey, vocalization, image, loadBoard };
    onClick(tile);
  };

  handleFocus = () => {
    const { id, onFocus } = this.props;
    onFocus(id);
  };

  render() {
    const { className, children, loadBoard, label, image, color } = this.props;

    return (
      <button
        className={classNames('Tile', className, color, {
          'Tile--folder': !!loadBoard
        })}
        onFocus={this.handleFocus}
        onClick={this.handleClick}
        ref={element => (this.tileElement = element)}
      >
        <Symbol label={label} image={image} />
        {children}
      </button>
    );
  }
}

export default Tile;
