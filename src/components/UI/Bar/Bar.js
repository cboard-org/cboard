import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Bar.css';

export class Bar extends Component {
  static propTypes = {
    as: PropTypes.node,
    direction: PropTypes.oneOf(['vertical', 'horizontal']),
    groupStart: PropTypes.node,
    groupMiddle: PropTypes.node,
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
