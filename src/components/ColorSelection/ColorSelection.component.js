import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from 'material-ui/ButtonBase';
import classNames from 'classnames';

import './ColorSelection.css';

const propTypes = {
  colors: PropTypes.arrayOf(PropTypes.object),
  selectedColor: PropTypes.bool,
  onColorSelect: PropTypes.func
};

const defaultProps = {
  colors: [
    { name: 'purple', value: '#CE93D8' },
    { name: 'blue', value: '#2196F3' },
    { name: 'green', value: '#4CAF50' },
    { name: 'red', value: '#E57373' }
  ]
};

const ColorSelection = ({ colors, selectedColor, onColorSelect }) => (
  <ul className="ColorSelection">
    {colors.map(color => (
      <li key={color.value} className="ColorSelection__item">
        <ButtonBase
          className={classNames('ColorSelection__button', {
            'ColorSelection__button--selected': selectedColor === color.name
          })}
          focusRipple
          style={{ background: color.value, borderRadius: '50%' }}
          onClick={() => onColorSelect(color)}
        />
      </li>
    ))}
  </ul>
);

ColorSelection.propTypes = propTypes;
ColorSelection.defaultProps = defaultProps;

export default ColorSelection;
