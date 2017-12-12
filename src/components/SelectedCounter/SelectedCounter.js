import React from 'react';
import PropTypes from 'prop-types';
import './SelectedCounter.css';

const propTypes = {
  count: PropTypes.number,
  text: PropTypes.string
};

const defaultProps = {
  count: 0,
  text: 'items selected'
};

const SelectedCounter = ({ count, text }) => (
  <div className="SelectedCounter">
    <span>{`${count} ${text}`}</span>
  </div>
);

SelectedCounter.propTypes = propTypes;
SelectedCounter.defaultProps = defaultProps;

export default SelectedCounter;
