import React from 'react';
import PropTypes from 'prop-types';
import { FormLabel, FormControl } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';

import './ColorSelection.css';

const Circle = ({ fill, strokeWidth = 0 }) => {
  return (
    <svg height="48" width="48">
      <circle
        cx="24"
        cy="24"
        r="20"
        fill={fill}
        stroke="black"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

const propTypes = {
  colors: PropTypes.arrayOf(PropTypes.object),
  selectedColor: PropTypes.string,
  onColorChange: PropTypes.func
};

const defaultProps = {
  colors: [
    { name: 'purple', value: '#CE93D8' },
    { name: 'blue', value: '#2196F3' },
    { name: 'green', value: '#4CAF50' },
    { name: 'red', value: '#E57373' }
  ]
};

const ColorSelection = ({ colors, selectedColor, onColorChange }) => (
  <FormControl className="ColorSelection">
    <FormLabel>Color</FormLabel>
    <RadioGroup
      aria-label="color"
      name="color"
      value={selectedColor}
      style={{ flexDirection: 'row' }}
      onChange={onColorChange}
    >
      {colors.map(color => (
        <Radio
          key={color.name}
          value={color.name}
          aria-label={color.name}
          icon={<Circle fill={color.value} />}
          checkedIcon={<Circle fill={color.value} strokeWidth={'3'} />}
        />
      ))}
    </RadioGroup>
  </FormControl>
);

ColorSelection.propTypes = propTypes;
ColorSelection.defaultProps = defaultProps;

export default ColorSelection;
