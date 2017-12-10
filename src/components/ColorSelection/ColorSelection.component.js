import React from 'react';
import PropTypes from 'prop-types';

import './ColorSelection.css';

const propTypes = {
  colors: PropTypes.arrayOf(PropTypes.object),
  onColorSelect: PropTypes.func
};

const defaultProps = {
  colors: [
    { name: 'purple', value: '#651FFF' },
    { name: 'blue', value: '#2979FF' },
    { name: 'green', value: '#00E676' },
    { name: 'red', value: '#FF3D00' }
  ]
};

const ColorSelection = ({ colors, onColorSelect }) => (
  <ul className="ColorSelection">
    {colors.map(color => (
      <li key={color.value} className="ColorSelection__item">
        <button
          className="ColorSelection__button"
          style={{ background: color.value }}
          onClick={() => onColorSelect(color)}
        />
      </li>
    ))}
  </ul>
);

ColorSelection.propTypes = propTypes;
ColorSelection.defaultProps = defaultProps;

export default ColorSelection;
