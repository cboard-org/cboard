import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import messages from './ColorSelection.messages';
import './ColorSelection.css';

const Circle = ({ fill, strokeWidth = 0 }) => {
  return (
    <svg height="48" width="48">
      <circle
        cx="24"
        cy="24"
        r="15"
        fill={fill}
        stroke="black"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

const propTypes = {
  intl: intlShape.isRequired,
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

const ColorSelection = ({ intl, colors, selectedColor, onColorChange }) => {
  const colorString = intl.formatMessage(messages.color);

  return (
    <FormControl className="ColorSelection">
      <FormLabel>{colorString}</FormLabel>
      <RadioGroup
        aria-label={colorString}
        name="color"
        value={selectedColor}
        style={{ flexDirection: 'row' }}
        onChange={onColorChange}
      >
        {colors.map(color => (
          <Radio
            key={color.name}
            value={color.value}
            aria-label={color.name}
            icon={<Circle fill={color.value} />}
            checkedIcon={<Circle fill={color.value} strokeWidth={'2'} />}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

ColorSelection.propTypes = propTypes;
ColorSelection.defaultProps = defaultProps;

export default injectIntl(ColorSelection);
