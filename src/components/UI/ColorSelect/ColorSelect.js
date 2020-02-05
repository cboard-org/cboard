import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import CloseIcon from '@material-ui/icons/Close';
import MenuItem from '@material-ui/core/MenuItem';
import { InputLabel, Select } from '@material-ui/core';

import IconButton from '../IconButton';
import Circle from './Circle';
import messages from './ColorSelect.messages';

const colorSchemes = [
  {
    name: 'Cboard',
    colors: ['#bbdefb', '#fff176', '#CE93D8', '#2196F3', '#4CAF50', '#E57373']
  },
  {
    name: 'Fitzgerald',
    colors: [
      '#2196F3',
      '#4CAF50',
      '#fff176',
      '#ff6600',
      '#ffffff',
      '#ffc0cb',
      '#800080',
      '#a52a2a',
      '#ff0000',
      '#808080'
    ]
  },
  {
    name: 'Goossens',
    colors: ['#ffc0cb', '#2196F3', '#4CAF50', '#fff176', '#ff6600']
  }
];

const propTypes = {
  intl: intlShape.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedColor: PropTypes.string.isRequired
};

class ColorSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      colorMenu: colorSchemes[0]
    };
  }

  handleColorSchemeChange = event => {
    this.setState({ colorMenu: event.target.value });
  };

  render() {
    const { intl, onChange, selectedColor } = this.props;
    const colorLabel = intl.formatMessage(messages.color);
    const radioGroupStyle = { flexDirection: 'row' };
    const radioItemStyle = { padding: '2px' };

    return (
      <FormControl className="ColorSelect">
        <div>
          <FormControl fullWidth id="color-scheme-menu">
            <InputLabel id="color-scheme-menu-label">
              {intl.formatMessage(messages.colorScheme)}
            </InputLabel>
            <Select
              id="color-scheme"
              labelId="color-scheme-menu-label"
              value={this.state.colorMenu}
              onChange={this.handleColorSchemeChange}
            >
              <MenuItem value={colorSchemes[0]}>
                {colorSchemes[0].name}
              </MenuItem>
              <MenuItem value={colorSchemes[1]}>
                {colorSchemes[1].name}
              </MenuItem>
              <MenuItem value={colorSchemes[2]}>
                {colorSchemes[2].name}
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <RadioGroup
          aria-label={colorLabel}
          name="color"
          value={selectedColor}
          style={radioGroupStyle}
          onChange={onChange}
        >
          {this.state.colorMenu.colors.map(color => (
            <Radio
              key={color}
              value={color}
              style={radioItemStyle}
              icon={<Circle fill={color} />}
              checkedIcon={<Circle fill={color} />}
            />
          ))}
          {selectedColor && (
            <IconButton
              label={intl.formatMessage(messages.clearSelection)}
              onClick={() => {
                onChange();
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </RadioGroup>
      </FormControl>
    );
  }
}

ColorSelect.propTypes = propTypes;
export default injectIntl(ColorSelect);
