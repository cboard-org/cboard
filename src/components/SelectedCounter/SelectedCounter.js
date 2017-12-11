import React from 'react';
import PropTypes from 'prop-types';
import './SelectedCounter.css';

const SelectedCounter = ({ count, text }) => (
  <div className="SelectedCounter__container">
    <span>{`${count} ${text}`}</span>
  </div>
);

SelectedCounter.propTypes = {
  count: PropTypes.number,
  text: PropTypes.string
};

SelectedCounter.defaultProps = {
  count: 0,
  text: 'items selected'
};

export default SelectedCounter;
