import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Bar.css';

export class Bar extends Component {
  static propTypes = {
    /**
     * The component used for the root node. Either a string to use a DOM element or a component.
     */
    as: PropTypes.node,
    /**
     * Bar direction
     */
    direction: PropTypes.oneOf(['vertical', 'horizontal']),
    /**
     * Component to render
     */
    groupStart: PropTypes.node,
    /**
     * Component to render
     */
    groupMiddle: PropTypes.node,
    /**
     * Component to render
     */
    groupEnd: PropTypes.node
  };

  static defaultProps = {
    as: 'div',
    direction: 'horizontal'
  };

  render() {
    const {
      as: T,
      className,
      direction,
      groupStart,
      groupMiddle,
      groupEnd,
      ...other
    } = this.props;

    const barClassName = classNames(className, 'Bar', {
      'Bar--vertical': direction === 'vertical'
    });

    return (
      <T className={barClassName} {...other}>
        <div className="Bar__group--start">{groupStart}</div>
        <div className="Bar__group--middle">{groupMiddle}</div>
        <div className="Bar__group--end">{groupEnd}</div>
      </T>
    );
  }
}

export default Bar;
