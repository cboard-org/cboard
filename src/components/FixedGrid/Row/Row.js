import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './Row.module.css';

function Row(props) {
  const { className, ...other } = props;

  const rowClassName = classNames(styles.root, className);

  return <div className={rowClassName} {...other} />;
}

Row.propTypes = {
  /**
   * Row content.
   */
  children: PropTypes.node
};

export default Row;
