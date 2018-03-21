import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Symbol from '../../UI/Symbol';
import './BoardButton.css';

class BoardButton extends PureComponent {
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
     * Board button ID
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
    img: PropTypes.string,
    /**
     * Board to load on click
     */
    loadBoard: PropTypes.string,
    /**
     * Callback fired when clicking a button
     */
    onClick: PropTypes.func,
    /**
     * Callback fired when button is focused
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
     * If true, button element will be focused
     */
    hasFocus: PropTypes.bool,
    /**
     * Custom button color
     */
    color: PropTypes.string
  };

  static defaultProps = {
    color: ''
  };

  componentDidMount() {
    this.updateFocus();
  }

  componentDidUpdate() {
    this.updateFocus();
  }

  updateFocus() {
    if (this.props.hasFocus) {
      this.buttonElement.focus();
    }
  }

  handleClick = () => {
    const {
      id,
      type,
      label,
      labelKey,
      vocalization,
      img,
      loadBoard,
      onClick
    } = this.props;
    const button = { id, type, label, labelKey, vocalization, img, loadBoard };
    onClick(button);
  };

  handleFocus = () => {
    const { id, onFocus } = this.props;
    onFocus(id);
  };

  handleTouchStart = () => {
    const { onTouchStart } = this.props;
    onTouchStart();
  };

  handleMouseDown = () => {
    const { onMouseDown } = this.props;
    onMouseDown();
  };

  render() {
    const { className, children, loadBoard, label, img, color } = this.props;

    return (
      <button
        className={classNames('BoardButton', className, color, {
          'BoardButton--folder': !!loadBoard
        })}
        onFocus={this.handleFocus}
        onClick={this.handleClick}
        onTouchStart={this.handleTouchStart}
        onMouseDown={this.handleMouseDown}
        ref={element => (this.buttonElement = element)}
      >
        <Symbol label={label} img={img} />
        {children}
      </button>
    );
  }
}

export default BoardButton;
